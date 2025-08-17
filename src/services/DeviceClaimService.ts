import { FindOptions, ModelStatic } from "sequelize";
import { BaseService } from "../base/BaseService";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import Device from "../database/models/Device";
import User from "../database/models/User";
import DeviceClaim from "../database/models/DeviceClaim";
import { generateCodeClaimHash } from "../utils/cripto";

type IssueDeviceDTO = {
	deviceId: string;
	ctx?: RequesterCtx;
};

type CreateClaimDTO = {
	deviceId: string;
	issuedByUserId: string;
	codeHash: string;
};

type RequesterCtx = { id: string; role: "admin" | "user" };

class DeviceClaimService extends BaseService<DeviceClaim, CreateClaimDTO> {
	protected model: ModelStatic<DeviceClaim> = DeviceClaim;

	constructor() {
		super(DeviceClaim);
	}

	public async issue({ deviceId, ctx }: IssueDeviceDTO) {
		const exists = await this.model.findOne({
			where: { deviceId },
		});

		if (exists) {
			return new CommSensoResponse<DeviceClaim>({
				status: 409,
				message: "Esse dispositivo já possui um código de resgate ativo",
			});
		}

		const { code, hash } = generateCodeClaimHash();

		const res = await super.add({
			deviceId,
			issuedByUserId: ctx!.id,
			codeHash: hash,
		});

		if (res.status === 201) {
			return new CommSensoResponse<{ code: string }>({
				data: { code },
				status: 201,
				message:
					"Código de resgate de dispositivo criado, guarde o código pois não será possível recuperá-lo posteriormente",
			});
		}

		return res;
	}
}

export default DeviceClaimService;
