import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/BaseController";
import Measure from "../database/models/Measure";
import MeasureService from "../services/MeasureService";
import ContainerService from "../services/ContainerService";

const validFields = ["value", "dtMeasure", "sensorId", "containerId"] as const;
type Field = (typeof validFields)[number];
type Direction = "ASC" | "DESC";

class MeasureController extends BaseController<Measure> {
	protected readonly service: MeasureService;

	constructor() {
		const measureService = new MeasureService();
		super(measureService);
		this.service = measureService;
	}

	public override async create(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const { value, dtMeasure, sensorId, container } = req.body;

			const containerService = new ContainerService();
			const containerResponse = await containerService.getByName(container);
			const containerId = containerResponse.data?.id ?? -1;

			if (containerId === -1) {
				return res.status(404).json({ message: "Container não encontrado" });
			}

			const { message, status, data, total } = await this.service.add({
				value,
				dtMeasure: new Date(dtMeasure),
				sensorId,
				containerId,
			});

			return res.status(status ?? 200).json({ message, data, total });
		} catch (error) {
			next(error);
		}
	}

	public async list(req: Request, res: Response, next: NextFunction) {
		try {
			const { limit, page, orderBy, startDate, endDate, ...query } = req.query;

			let orderClause: [Field, Direction][] | undefined = undefined;
			if (typeof orderBy === "string") {
				const [field, dir] = orderBy.split(":") as [Field, Direction];
				const upperDir = dir?.toUpperCase() as Direction;

				if (
					!validFields.includes(field) ||
					!["ASC", "DESC"].includes(upperDir)
				) {
					return res
						.status(400)
						.json({ message: "Parâmetros de ordenação inválidos." });
				}
				orderClause = [[field, upperDir]];
			}

			const pageLimit = limit ? Number(limit) : 10;
			const offset = page ? (Number(page) - 1) * pageLimit : 0;

			const filters = {
				limit: pageLimit,
				offset: offset,
				orderBy: orderClause,
				...query,
				startDate: startDate ? String(startDate) : undefined,
				endDate: endDate ? String(endDate) : undefined,
			};

			const { message, status, data, total } = await this.service.list(filters);

			return res.status(status ?? 200).json({ message, data, total });
		} catch (error) {
			next(error);
		}
	}

	// public async search(req: Request, res: Response, next: NextFunction) {
	//   try {
	//     // Supondo que seu service tenha um método search, caso contrário, ajuste
	//     const { message, status, data, total } = await this.service.search(req.body);
	//     return res.status(status ?? 200).json({ message, data, total });
	//   } catch (error) {
	//     next(error);
	//   }
	// }
}

export default MeasureController;
