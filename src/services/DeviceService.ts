import { FindOptions, ModelStatic } from "sequelize";
import { BaseService } from "../base/BaseService";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import Device from "../database/models/Device";
import User from "../database/models/User";

type CreateInputDTO = {
	name: string;
	macAddress: string;
	ownerUserId?: string;
};

type RequesterCtx = { id: string; role: "admin" | "user" };

class DeviceService extends BaseService<Device, CreateInputDTO> {
	protected model: ModelStatic<Device> = Device;

	constructor(private userModel: ModelStatic<User> = User) {
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

	public async add({ macAddress, name, ownerUserId }: CreateInputDTO) {
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

		return super.add({ macAddress, name, ownerUserId });
	}
}

export default DeviceService;
