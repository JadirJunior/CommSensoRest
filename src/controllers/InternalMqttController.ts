import { Request, Response } from "express";
import Device from "../database/models/Device";
import { compareHash } from "../utils/cripto";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import { verifyToken } from "../auth/auth";
import User from "../database/models/User";

const topicMatches = (pattern: string, topic: string) => {
	// suporta '+' e '#'
	const p = pattern.split("/");
	const t = topic.split("/");
	for (let i = 0, j = 0; i < p.length; i++, j++) {
		if (p[i] === "#") return true;
		if (j >= t.length) return false;
		if (p[i] === "+") continue;
		if (p[i] !== t[j]) return false;
	}
	return t.length === p.length;
};

const buildOwnedScope = async (userId: string) => {
	// pegue apenas devices ativos que o usuário é dono
	const owned = await Device.findAll({
		where: { ownerUserId: userId, status: "active" },
		attributes: ["id", "tenantId", "appId"],
		raw: true,
	});

	const subscribe: string[] = [];
	const publish: string[] = [];

	for (const d of owned as any[]) {
		const base = `${d.tenantId}/${d.appId}/devices/${d.id}`;
		subscribe.push(`${base}/state`, `${base}/cmd/ack`, `${base}/measure`);
	}

	// dedup
	return {
		subscribe: Array.from(new Set(subscribe)),
		publish: Array.from(new Set(publish)),
	};
};

// parse só para validar estrutura básica quando for o caso
const parseDeviceTopic = (topic: string) => {
	const parts = topic.split("/");
	// esperado: {tenant}/{app}/devices/{device}/{...}
	if (parts.length < 5) return null;
	const [tenantId, appId, devicesLiteral, deviceId, ...tail] = parts;
	if (devicesLiteral !== "devices") return null;
	return { tenantId, appId, deviceId, tail };
};

export class InternalMqttController {
	async authDevice(req: Request, res: Response) {
		console.log("Internal MQTT Auth called");
		const { client_id, username, password } = req.body || {};

		if (!client_id || !username || !password) {
			return res.json({ ok: false });
		}
		console.log("Auth request:", { client_id, username });

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

		console.log("Auth result:", { client_id, username, ok });

		return res.json(
			new CommSensoResponse({
				status: ok ? 200 : 401,
				...(ok && {
					data: { deviceId: dev.id, tenantId: dev.tenantId, appId: dev.appId },
				}),
			})
		);
	}

	async authApp(req: Request, res: Response) {
		console.log("Internal Mqtt App Auth called");
		const { username, token } = req.body || {};

		if (!username || !token) {
			return res.json({ ok: false });
		}
		console.log("Auth request:", { username, token });

		const decoded = verifyToken(token) as { id: string } | null;

		if (!decoded?.id) {
			return res.json({ status: 401, message: "Invalid or expired token" });
		}

		const user = await User.findByPk(decoded.id, {
			attributes: ["id", "username", "role"],
		});

		if (!user) {
			return res.json({ status: 401, message: "Unauthorized" });
		}

		console.log("Auth result:", { username, user });

		return res.json(
			new CommSensoResponse({
				status: 200,
			})
		);
	}

	async authorize(req: Request, res: Response) {
		try {
			const { token, action, topic } = req.body || {};

			if (!token || !action || !topic)
				return res.json(
					new CommSensoResponse({ status: 400, message: "missing fields" })
				);

			const decoded = verifyToken(token) as { id: string } | null;
			if (!decoded?.id)
				return res.json({ allow: false, reason: "invalid token" });

			const parsed = parseDeviceTopic(topic);
			if (!parsed) return res.json({ allow: false, reason: "bad topic" });

			// 2) encontre o device e cheque ownership
			const dev = await Device.findByPk(parsed.deviceId, {
				attributes: ["id", "tenantId", "appId", "ownerUserId", "status"],
				raw: true,
			});

			console.log("Dados da requisição de autorização:", {
				token,
				action,
				topic,
				parsed,
				dev,
			});

			if (!dev || dev.status !== "active")
				return res.json({ allow: false, reason: "unknown or inactive device" });
			if (dev.ownerUserId !== decoded.id)
				return res.json({ allow: false, reason: "not owner" });

			// 3) cheque rota/tail e ação
			// SUB permitido: state, cmd/ack
			// PUB permitido: cmd/power, cmd/cfg
			const base = `${dev.tenantId}/${dev.appId}/devices/${dev.id}`;

			if (action === "subscribe") {
				const allow =
					topic === `${base}/state` ||
					topic === `${base}/cmd/ack` ||
					topic === `${base}/measure`;
				return res.json(
					new CommSensoResponse({ status: 200, data: { allow } })
				);
			} else if (action === "publish") {
				const allow =
					topic === `${base}/cmd/power` || topic === `${base}/cmd/cfg`;
				return res.json(
					new CommSensoResponse({ status: 200, data: { allow } })
				);
			} else {
				return res.json(
					new CommSensoResponse({
						status: 403,
						data: { allow: false },
						message: "unknown action",
					})
				);
			}
		} catch (e) {
			console.error("authorize error:", e);
			return res.json(
				new CommSensoResponse({
					status: 500,
					data: { allow: false },
					message: "error",
				})
			);
		}
	}
}
