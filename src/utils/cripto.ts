import bcrypt from "bcryptjs";

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
