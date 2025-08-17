import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/BaseController";
import Device from "../database/models/Device";
import DeviceService from "../services/DeviceService";
import DeviceClaim from "../database/models/DeviceClaim";
import DeviceClaimService from "../services/DeviceClaimService";

class DeviceClaimController extends BaseController<DeviceClaim> {
	protected readonly service: DeviceClaimService;

	constructor(service: DeviceClaimService) {
		super(service);
		this.service = service;
	}

	async updateById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const attributes = req.body;
			const { message, status } = await this.service.update({ id }, attributes);
			res.status(status ?? 200).json({ message });
		} catch (error) {
			next(error);
		}
	}

	async issueDevice(req: Request, res: Response, next: NextFunction) {
		try {
			const ctx = { id: req.user!.id, role: req.user!.role };

			const { deviceId } = req.body;

			const result = await this.service.issue({ deviceId, ctx });
			res
				.status(result.status ?? 200)
				.json({ message: result.message, data: result.data });
		} catch (error) {
			next(error);
		}
	}
}

export default DeviceClaimController;
