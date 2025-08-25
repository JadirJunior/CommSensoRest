import { Request, Response, NextFunction } from "express";

export function verifyBrokerToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const auth = req.header("authorization") || "";
	const expected = `Bearer ${process.env.BROKER_TOKEN}`;
	if (auth !== expected) return res.status(401).json({ ok: false });
	next();
}
