import { Request, Response } from "express";
import Device from "../database/models/Device";
import { compareHash } from "../utils/cripto";

export class InternalMqttController {
	static async auth(req: Request, res: Response) {
		const { client_id, username, password } = req.body || {};

		if (!client_id || !username || !password) {
			return res.json({ ok: false });
		}
		if (client_id !== username) {
			return res.json({ ok: false, status: "mismatch" });
		}

		const dev = await Device.findOne({ where: { mqttClientId: client_id } });
		if (!dev) return res.json({ ok: false, status: "unknown" });

		if (dev.status !== "active")
			return res.json({ ok: false, status: dev.status });

		if (!dev.mqttSecretHash)
			return res.json({ ok: false, status: "no_secret" });
		const ok = compareHash(password, dev.mqttSecretHash);

		return res.json({
			ok,
			status: ok ? "active" : "bad_credentials",
			device_id: dev.id,
		});
	}
}
