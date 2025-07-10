import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/BaseController";
import Measure from "../database/models/Measure";
import MeasureService from "../services/MeasureService";
import ContainerService from "../services/ContainerService";

type MeasureOrderBy = {
	field: Field;
	direction: Direction;
};

const validFields = ["value", "dtMeasure", "sensorId", "containerId"] as const;
type Field = (typeof validFields)[number];
type Direction = "ASC" | "DESC";

class MeasureController extends BaseController<Measure> {
	protected readonly service: MeasureService;

	constructor(service: MeasureService) {
		super(service);
		this.service = service;
	}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { value, dtMeasure, sensorId, container } = req.body;

			const containerId = await new ContainerService()
				.getByName(container)
				.then((response) => response.data?.id ?? -1);

			if (containerId == -1) {
				return res.status(404).json({ message: "Container not found" });
			}

			const dateMeasure = new Date(dtMeasure);

			const { message, status, data } = await this.service.add({
				value,
				dtMeasure: dateMeasure,
				sensorId,
				containerId,
			});

			return res.status(status ?? 200).json({ message, data });
		} catch (error) {
			next(error);
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const { limit, page, ...query } = req.query;

			const { orderBy }: { orderBy?: MeasureOrderBy } = req.body;

			const { field, direction } = orderBy as {
				field: Field;
				direction: Direction;
			};
			let orderClause: [[Field, Direction]] = [["dtMeasure", "DESC"]];

			if (
				validFields.includes(field) &&
				(direction === "ASC" || direction === "DESC")
			) {
				orderClause = [[field, direction]];
			}

			const attributes = {
				limit: limit ? Number(limit) : 10,
				offset: page
					? (Number(page) - 1) * (req.query.limit ? Number(limit) : 10)
					: 0,
				where: { ...query },
				orderBy: orderClause,
			};

			const { message, status, data } = await this.service.getAll(attributes);
			return res.status(status ?? 200).json({ message, data });
		} catch (error) {
			next(error);
		}
	}
}

export default MeasureController;
