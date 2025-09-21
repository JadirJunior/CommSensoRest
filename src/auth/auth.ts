import jwt from "jsonwebtoken";
import User from "../database/models/User";

// Função para criar os tokens
export const createToken = (
	user: User
): { accessToken: string; refreshToken: string } => {
	const information: Omit<User, "password"> = user;

	console.log("Secret: ", process.env.JWT_SECRET);
	console.log("Refresh Secret: ", process.env.JWT_REFRESH_SECRET);

	if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET)
		return { accessToken: "", refreshToken: "" };

	console.log("Encontrou as chaves JWT");

	const accessToken = jwt.sign({ user: information }, process.env.JWT_SECRET, {
		expiresIn: "1h", // 1 hora de expiração
	});

	const refreshToken = jwt.sign(
		{ user: information },
		process.env.JWT_REFRESH_SECRET, // Chave diferente para o refresh token
		{
			expiresIn: "7d", // 7 dias de expiração
		}
	);

	return { accessToken, refreshToken };
};

// Função para verificar o token
export const verifyToken = (token: string): Omit<User, "password"> | null => {
	if (!process.env.JWT_SECRET) return null;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
			user: Omit<User, "password">;
		};
		// console.log("User Authenticated:", decoded.user);
		return decoded.user;
	} catch (error) {
		console.log(error);
		return null; // Retorna null se o token for inválido ou expirado
	}
};
