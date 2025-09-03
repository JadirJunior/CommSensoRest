import { Request, Response } from "express";
import Device from "../database/models/Device";
import { compareHash } from "../utils/cripto";
import { CommSensoResponse } from "../utils/CommSensoResponse";

export class InternalMqttController {
	static async auth(req: Request, res: Response) {
		const { client_id, username, password } = req.body || {};

		if (!client_id || !username || !password) {
			return res.json({ ok: false });
		}

		if (client_id !== username) {
			return res.json(
				new CommSensoResponse({ status: 400, message: "mismatch" })
			);
		}

		const dev = await Device.scope("withSecret").findOne({
			where: { mqttClientId: client_id },
		});
		if (!dev)
			return res.json(
				new CommSensoResponse({
					status: 404,
					message: "Dispositivo desconhecido",
				})
			);

		if (dev.status !== "active")
			return res.json(
				new CommSensoResponse({
					status: 403,
					message: "Dispositivo inativo ou bloqueado",
				})
			);

		if (!dev.mqttSecretHash)
			return res.json(
				new CommSensoResponse({
					message: "Senha não encontrada",
					status: 404,
				})
			);
		const ok = compareHash(password, dev.mqttSecretHash);

		return res.json(
			new CommSensoResponse({
				status: ok ? 200 : 401,
				...(ok && {
					data: { deviceId: dev.id, tentantId: dev.tenantId, appId: dev.appId },
				}),
			})
		);
	}
}
