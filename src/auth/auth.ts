import User from "../database/models/User";
import jwt from "jsonwebtoken";

export const createToken = (user: User): string => {
	const information: Omit<User, "password"> = user;

	if (!process.env.JWT_SECRET) return "";

	const token = jwt.sign({ user: information }, process.env.JWT_SECRET || "", {
		expiresIn: "1h",
	});

	return token;
};

export const verifyToken = (token: string): Omit<User, "password"> | null => {
	if (!process.env.JWT_SECRET) return null;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
			user: Omit<User, "password">;
		};

		return decoded.user;
	} catch (error) {
		return null;
	}
};
