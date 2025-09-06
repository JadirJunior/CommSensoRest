import { FindOptions, ModelStatic, Sequelize, where } from "sequelize";
import { BaseService } from "../base/BaseService";
import crypto from "crypto";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import Device from "../database/models/Device";
import User from "../database/models/User";
import DeviceClaim from "../database/models/DeviceClaim";
import { compareHash, generateHash } from "../utils/cripto";
import dayjs from "dayjs";
import sequelizeConnection from "../config/databaseConfig";
import { publishBootstrapEncrypted } from "../utils/publishBootstrap";

type CreateInputDTO = {
	name: string;
	macAddress: string;
	appId?: string;
	tenantId?: string;
	ownerUserId?: string;
};

type RequesterCtx = { id: string; role: "admin" | "user" };

function genSecretB64Url(bytes = 32) {
	return crypto
		.randomBytes(bytes)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

class DeviceService extends BaseService<Device, CreateInputDTO> {
	protected model: ModelStatic<Device> = Device;

	constructor(private deviceClaim: ModelStatic<DeviceClaim>) {
		super(Device);
	}

	public async getByName(name: string): Promise<CommSensoResponse<Device>> {
		const result = await this.model.findOne({
			where: { name },
		});

		return new CommSensoResponse<Device>({
			data: result ?? undefined,
			status: 200,
			message: "Request with successful",
		});
	}

	public async listForRequester(
		ctx: RequesterCtx
	): Promise<CommSensoResponse<any[] | Device[]>> {
		if (!ctx) {
			return new CommSensoResponse<any[] | Device[]>({
				data: [],
				status: 404,
				message: "User not found",
			});
		}

		const options: FindOptions = {
			where: ctx.role === "admin" ? {} : { ownerUserId: ctx.id },
		};

		const devices = await this.model.findAll({
			...options,
		});

		return new CommSensoResponse<Device[]>({
			data: devices,
			status: 200,
			message: "Listed with successfull",
		});
	}

	public async add({
		macAddress,
		name,
		ownerUserId,
		appId,
		tenantId,
	}: CreateInputDTO) {
		const existsMac = await this.model.findOne({
			where: { macAddress: macAddress.replace(/:/g, "").toLowerCase() },
		});

		if (existsMac)
			return new CommSensoResponse<Device>({
				data: existsMac,
				status: 409,
				message: "Este endereço MAC já está em uso.",
			});

		if (ownerUserId) {
			const existsName = await this.model.findOne({
				where: { ownerUserId: ownerUserId, name: name },
			});
			if (existsName)
				return new CommSensoResponse<Device>({
					data: existsName,
					status: 409,
					message: "Você já possui um device com esse nome.",
				});
		}

		return super.add({ macAddress, name, ownerUserId, tenantId, appId });
	}

	public async redeemDevice({
		deviceId,
		code,
		ctx,
		forceRotate = false,
	}: {
		deviceId: string;
		code: string;
		ctx: RequesterCtx;
		forceRotate?: boolean;
	}) {
		// Dados para publish depois do commit
		let toPublish:
			| {
					deviceId: string;
					code: string;
					mqttCreds: { username: string; password: string };
					extra: Record<string, unknown>;
			  }
			| undefined;

		let response!: CommSensoResponse<ReturnType<Device["toJSON"]>>;

		await sequelizeConnection.transaction(async (transaction) => {
			const claim = await this.deviceClaim.findOne({
				where: { deviceId },
				transaction,
				lock: transaction.LOCK.UPDATE,
			});

			if (!claim || claim.status !== "issued")
				return (response = new CommSensoResponse<Device>({
					status: 404,
					message: "Código de resgate inválido ou expirado.",
				}));

			if (claim.expiresAt && dayjs(claim.expiresAt).isBefore(dayjs()))
				return (response = new CommSensoResponse<Device>({
					status: 404,
					message: "Código de resgate inválido ou expirado.",
				}));

			if (!compareHash(code, claim.codeHash))
				return (response = new CommSensoResponse<Device>({
					status: 404,
					message: "Código de resgate inválido ou expirado.",
				}));

			const device = await this.model.findByPk(deviceId, {
				transaction,
				lock: transaction.LOCK.UPDATE,
			});

			if (!device)
				return (response = new CommSensoResponse<Device>({
					status: 404,
					message: "Dispositivo não encontrado.",
				}));

			if (device.ownerUserId && device.ownerUserId !== ctx.id)
				return (response = new CommSensoResponse<Device>({
					status: 409,
					message: "Dispositivo já possui proprietário.",
				}));

			if (!device.appId || !device.tenantId) {
				return (response = new CommSensoResponse<Device>({
					status: 400,
					message:
						"Dispositivo não está associado a um aplicativo ou organização. Contate o suporte.",
				}));
			}

			let mqttSecretPlain: string | null = null;
			const mustRotate = forceRotate || !device.mqttSecretHash;

			if (mustRotate) {
				mqttSecretPlain = genSecretB64Url(32);
				const hash = generateHash(mqttSecretPlain);

				if (!device.mqttClientId) {
					const macnorm = (device.macAddress || "")
						.replace(/:/g, "")
						.toLowerCase();
					device.mqttClientId = `dev-${macnorm}`;
				}

				await device.update({ mqttSecretHash: hash }, { transaction });
			}

			await claim.update(
				{ status: "redeemed", redeemedAt: dayjs().toDate() } as any,
				{
					transaction,
				}
			);

			await device.update(
				{
					status: "active",
					ownerUserId: ctx.id,
					activatedAt: dayjs().toDate(),
				},
				{ transaction }
			);

			await device.reload({ transaction });

			const credentials = mqttSecretPlain
				? {
						clientId: device.mqttClientId,
						username: device.mqttClientId,
						password: mqttSecretPlain,
				  }
				: undefined;

			// prepara a resposta final
			response = new CommSensoResponse<ReturnType<typeof device.toJSON>>({
				data: { ...device.toJSON(), mqtt: credentials },
				status: 200,
				message: "Dispositivo resgatado com sucesso.",
			});

			// prepara o publish do bootstrap
			if (credentials) {
				toPublish = {
					deviceId: device.id,
					code,
					mqttCreds: {
						username: credentials.username,
						password: credentials.password,
					},
					extra: {
						tenantId: device.tenantId,
						appId: device.appId,
						deviceClientId: device.mqttClientId,
					},
				};
			}
		});

		if (toPublish) {
			try {
				await publishBootstrapEncrypted({
					brokerUrl: process.env.BROKER_URL!,
					brokerUser: process.env.BROKER_SVC_USER!,
					brokerPass: process.env.BROKER_SVC_PASS!,
					deviceId: toPublish.deviceId,
					code: toPublish.code,
					mqttCreds: toPublish.mqttCreds,
					extra: toPublish.extra,
				});
			} catch (e) {
				console.error("publishBootstrapEncrypted failed:", e);
				response = new CommSensoResponse({
					...response,
					message:
						"Dispositivo resgatado, mas houve erro ao publicar o bootstrap. Tente novamente.",
				}) as any;
			}
		}

		return response;
	}
}

export default DeviceService;
