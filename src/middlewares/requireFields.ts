import { Request, Response, NextFunction } from "express";

export function requireFields(fields: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		const missing = fields.filter((f) => !(req.body && req.body[f]));
		if (missing.length)
			return res
				.status(400)
				.json({ ok: false, message: `Missing: ${missing.join(", ")}` });
		next();
	};
}
