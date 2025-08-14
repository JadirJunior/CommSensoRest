import { ModelStatic } from "sequelize";
import { BaseService } from "../base/BaseService";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import Device from "../database/models/Device";

class DeviceService extends BaseService<Device> {
	protected model: ModelStatic<Device> = Device;

	constructor() {
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
}

export default DeviceService;
