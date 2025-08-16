import { NextFunction, Request, Response } from "express";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import { verifyToken } from "../auth/auth";

// Extend Express Request interface to include userId
declare global {
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}

export const authenticateUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.header("Authorization")?.replace("Bearer", "");

	if (!token)
		return res.status(401).json({
			status: 401,
			message: "Unauthorized",
		});

	try {
		const decoded = verifyToken(token);
		if (decoded) {
			req.userId = decoded?.id;
			next();
		}
		return res.status(401).json({
			message: "Invalid or expired token",
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error",
			status: 500,
		});
	}
};

// TODO: Authenticate admin

// TODO: User be the device owner
