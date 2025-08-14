import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/BaseController";
import Device from "../database/models/Device";
import DeviceService from "../services/DeviceService";

class DeviceController extends BaseController<Device> {
	protected readonly service: DeviceService;

	constructor(service: DeviceService) {
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
}

export default DeviceController;
