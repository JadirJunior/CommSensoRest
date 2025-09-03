import bcrypt from "bcryptjs";
import {
	createCipheriv,
	createDecipheriv,
	createHash,
	randomBytes,
} from "node:crypto";

export const compareHash = (value: string, hash: string): boolean => {
	return bcrypt.compareSync(value, hash);
};

export const generateHash = (value: string): string => {
	return bcrypt.hashSync(value, bcrypt.genSaltSync(10));
};

export const generateCodeClaimHash = (): { code: string; hash: string } => {
	// Generate a unique claim code with 3 characteres and 3 digits

	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numbers = "0123456789";
	let code = "";

	for (let i = 0; i < 4; i++) {
		code += letters.charAt(Math.floor(Math.random() * letters.length));
		code += numbers.charAt(Math.floor(Math.random() * numbers.length));
	}

	return { code, hash: generateHash(code) };
};

/** Envelope do payload cifrado (A256GCM + base64url). */
export type AesGcmPayload = {
	v: 1;
	alg: "A256GCM";
	iv: string; // base64url(12 bytes)
	tag: string; // base64url(16 bytes)
	data: string; // base64url(ciphertext)
	aad?: string; // base64url(AAD), opcional (ex.: deviceId)
};

// ---------- helpers ----------
const enc = new TextEncoder();
const dec = new TextDecoder();

const toB64u = (u8: Uint8Array) =>
	Buffer.from(u8)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");

const fromB64u = (s: string) =>
	new Uint8Array(
		Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64")
	);

const view = (buf: Buffer) =>
	new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);

function concatU8(a: Uint8Array, b: Uint8Array): Uint8Array {
	const out = new Uint8Array(a.length + b.length);
	out.set(a, 0);
	out.set(b, a.length);
	return out;
}

export function encryptByCode(
	code: string,
	obj: unknown,
	opts?: { aad?: string | Uint8Array }
): AesGcmPayload {
	const key = new Uint8Array(
		createHash("sha256").update(code, "utf8").digest()
	); // Uint8Array 32B
	const ivB = randomBytes(12); // Buffer 12B
	const iv = view(ivB); // Uint8Array view

	const cipher = createCipheriv("aes-256-gcm", key, iv);

	// AAD opcional (amarra a um identificador)
	let aadU8: Uint8Array | undefined;
	if (opts?.aad) {
		aadU8 = typeof opts.aad === "string" ? enc.encode(opts.aad) : opts.aad;
		cipher.setAAD(aadU8); // aceita ArrayBufferView
	}

	const plainU8 = enc.encode(JSON.stringify(obj));
	const p1 = view(cipher.update(plainU8)); // Buffer -> Uint8Array view
	const p2 = view(cipher.final());
	const ct = concatU8(p1, p2);

	const tag = view(cipher.getAuthTag()); // 16B

	return {
		v: 1,
		alg: "A256GCM",
		iv: toB64u(iv),
		tag: toB64u(tag),
		data: toB64u(ct),
		...(aadU8 && { aad: toB64u(aadU8) }),
	};
}

/** Decripta payload gerado por `encryptByCode`. */
export function decryptByCode<T = unknown>(
	code: string,
	payload: AesGcmPayload,
	opts?: { aad?: string | Uint8Array } // passe o MESMO AAD usado na cifra (se houver)
): T {
	const key = new Uint8Array(
		createHash("sha256").update(code, "utf8").digest()
	);
	const iv = fromB64u(payload.iv);
	const tag = fromB64u(payload.tag);
	const ct = fromB64u(payload.data);

	const decipher = createDecipheriv("aes-256-gcm", key, iv);
	if (opts?.aad) {
		const aadU8 =
			typeof opts.aad === "string" ? enc.encode(opts.aad) : opts.aad;
		decipher.setAAD(aadU8);
	} else if (payload.aad) {
		decipher.setAAD(fromB64u(payload.aad));
	}
	decipher.setAuthTag(tag);

	const d1 = view(decipher.update(ct));
	const d2 = view(decipher.final());
	const pt = concatU8(d1, d2);

	return JSON.parse(dec.decode(pt)) as T;
}
