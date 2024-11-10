import bcrypt from "bcryptjs";

export const compareHash = (value: string, hash: string): boolean => {
	return bcrypt.compareSync(value, hash);
};

export const generateHash = (value: string): string => {
	return bcrypt.hashSync(value, bcrypt.genSaltSync(10));
};
