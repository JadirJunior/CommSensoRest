import "express";

declare global {
	namespace Express {
		interface UserPayload {
			id: string;
			username: string;
			role: "admin" | "user";
		}
		interface Request {
			user?: UserPayload;
		}
	}
}
