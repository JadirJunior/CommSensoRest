// utils/publishBootstrapEncrypted.ts
import mqtt from "mqtt";
import { AesGcmPayload, encryptByCode } from "./cripto";

export async function publishBootstrapEncrypted(params: {
	brokerUrl: string;
	brokerUser: string;
	brokerPass: string;
	deviceId: string;
	code: string;
	mqttCreds: { username: string; password: string };
	extra?: Record<string, unknown>;
}) {
	const {
		brokerUrl,
		brokerUser,
		brokerPass,
		deviceId,
		code,
		mqttCreds,
		extra,
	} = params;

	const topic = `bootstrap/${deviceId}`;

	console.log("Publishing encrypted bootstrap to topic", topic);

	const clear = {
		ok: true,
		flow: "onboarding",
		next: "reconnect_with_issued_credentials",
		mqtt: mqttCreds,
		...(extra ?? {}),
	};

	// cifra com AES-256-GCM; AAD = deviceId (amarração)
	const sealed: AesGcmPayload = encryptByCode(code, clear, { aad: deviceId });

	await new Promise<void>((resolve, reject) => {
		const c = mqtt.connect(brokerUrl, {
			username: brokerUser,
			password: brokerPass,
			reconnectPeriod: 0,
		});

		c.once("connect", () => {
			c.publish(
				topic,
				JSON.stringify(sealed),
				{ qos: 1, retain: true },
				(err) => {
					c.end();
					err ? reject(err) : resolve();
				}
			);
		});

		c.once("error", (e) => {
			try {
				c.end();
			} catch {}
			reject(e);
		});
	});
}

/** (Opcional) limpa o retained de bootstrap após o login normal do device */
export function clearBootstrapTopic(params: {
	brokerUrl: string;
	brokerUser: string;
	brokerPass: string;
	deviceId: string;
}) {
	const { brokerUrl, brokerUser, brokerPass, deviceId } = params;
	const topic = `bootstrap/${deviceId}`;
	return new Promise<void>((resolve, reject) => {
		const c = mqtt.connect(brokerUrl, {
			username: brokerUser,
			password: brokerPass,
			reconnectPeriod: 0,
		});
		c.once("connect", () => {
			c.publish(topic, "", { qos: 1, retain: true }, (err) => {
				c.end();
				err ? reject(err) : resolve();
			});
		});
		c.once("error", (e) => {
			try {
				c.end();
			} catch {}
			reject(e);
		});
	});
}
