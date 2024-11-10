import { NextFunction, Request, Response } from "express";
import { IController } from "../interfaces/IController";
import { IService } from "../interfaces/IService";
import { Model } from "sequelize";

export abstract class BaseController<M extends Model> implements IController {
	protected readonly service!: IService<M>;

	constructor(service: IService<M>) {
		this.service = service;
	}

	async getAll(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<M, Record<string, M>> | undefined> {
		try {
			const { id } = req.query;

			if (id) {
				const { status, message, data } = await this.service.getById(
					id as string
				);
				return res.status(status ?? 200).json({ message, data });
			}

			const { status, message, data } = await this.service.getAll();
			return res.status(status ?? 200).json({ message, data });
		} catch (error) {
			next(error);
		}
	}

	async getById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<M, Record<string, M>> | undefined> {
		try {
			const { id } = req.params;
			const { status, message, data } = await this.service.getById(id);
			return res.status(status ?? 200).json({ message, data });
		} catch (error) {
			next(error);
		}
	}

	async create(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<M, Record<string, M>> | undefined> {
		try {
			const { data, message, status } = await this.service.add(req.body);
			return res.status(status ?? 200).json({ data, message });
		} catch (error) {
			next(error);
		}
	}

	async deleteById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response<M, Record<string, M>> | undefined> {
		try {
			const attributes: any = req.params;
			const { message, status } = await this.service.deleteById(attributes);
			return res.status(status ?? 200).json({ message });
		} catch (error) {
			res.status(500).json({ message: "Internal server error" });
		}
	}

	// async update(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> {
	//     try {
	//         const { id } = req.params;
	//         const attributes = req.body;
	//         console.log(id)
	//         const { message, status } = await this.service.update({ where: { id: Number(id) } }, attributes)
	//         return res.status(status ?? 200).json({message})

	//     } catch (error) {
	//         next(error)
	//     }
	// }
}
