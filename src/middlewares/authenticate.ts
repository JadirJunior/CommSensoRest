// src/middlewares/authenticate.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/auth";
import User from "../database/models/User";

type Role = "admin" | "user";

/**
 * Autentica via JWT e carrega o usuário ATUAL do banco.
 * Rejeita se token inválido/expirado, usuário inexistente ou inativo.
 * Anexa req.user = { id, username, role }
 */
export async function authenticateUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const header = req.header("Authorization");
		if (!header?.startsWith("Bearer ")) {
			return res.status(401).json({ status: 401, message: "Unauthorized" });
		}

		const token = header.slice(7);
		const decoded = verifyToken(token) as { id: string } | null;

		if (!decoded?.id) {
			return res
				.status(401)
				.json({ status: 401, message: "Invalid or expired token" });
		}

		const user = await User.findByPk(decoded.id, {
			attributes: ["id", "username", "role"],
		});

		if (!user) {
			return res.status(401).json({ status: 401, message: "Unauthorized" });
		}

		// Anexa o contexto autenticado ao Request
		req.user = {
			id: user.id,
			username: user.username,
			role: user.role as Role,
		};

		return next();
	} catch (err) {
		return res
			.status(401)
			.json({ status: 401, message: "Invalid or expired token" });
	}
}

/**
 * Middleware de autorização por papel.
 * Use depois do authenticateUser.
 */
export function requireRole(...roles: Role[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		const role = req.user?.role;
		if (!role) {
			return res.status(401).json({ status: 401, message: "Unauthorized" });
		}
		if (!roles.includes(role)) {
			return res.status(403).json({ status: 403, message: "Forbidden" });
		}
		return next();
	};
}

export const authenticateAdmin = [authenticateUser, requireRole("admin")];
