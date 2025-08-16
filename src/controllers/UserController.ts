import { BaseController } from "../base/BaseController";
import UserService from "../services/UserService";
import User from "../database/models/User";
import { NextFunction, Request, Response } from "express";
import { createToken } from "../auth/auth";

class UserServiceController extends BaseController<User> {
	protected readonly service: UserService;

	constructor(service: UserService) {
		super(service);
		this.service = service;
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password } = req.body;
			const { message, status, data } = await this.service.login(
				username,
				password
			);

			if (!data) {
				res.status(status ?? 200).json({ message });
				return;
			}

			res.status(status ?? 200).json({ message, data });
		} catch (error) {
			next(error);
		}
	}

	async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password } = req.body;
			const { message, status, data } = await this.service.createUser(
				username,
				password
			);

			res.status(status ?? 200).json({ message, data });
		} catch (error) {
			next(error);
		}
	}
}

export default UserServiceController;
