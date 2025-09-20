// middlewares/verifyBrokerToken.ts
import { Request, Response, NextFunction } from "express";

export function verifyBrokerToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const tokens = (process.env.BROKER_TOKENS || process.env.BROKER_TOKEN || "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);

	const m = /^Bearer\s+(.+)$/i.exec((req.header("authorization") || "").trim());
	const provided = m?.[1]?.trim() || "";

	if (!provided || tokens.length === 0) {
		return res.status(401).json({ ok: false });
	}
	if (!tokens.includes(provided)) {
		return res.status(401).json({ ok: false });
	}

	// contexto mínimo p/ service layer
	(req as any).user = { id: "broker", role: "service" };
	return next();
}
