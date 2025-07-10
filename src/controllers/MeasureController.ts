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
			const { limit, page, orderBy, ...query } = req.query;

			let orderClause: [Field, Direction][] = [["dtMeasure", "DESC"]];

			if (typeof orderBy === "string") {
				const parts = orderBy.split(":");
				if (parts.length !== 2) {
					return res.status(400).json({
						message: "Formato inválido para orderBy. Use 'field:direction'.",
					});
				}

				const [rawField, rawDir] = parts;
				const dir = rawDir.toUpperCase() as Direction;

				if (!validFields.includes(rawField as Field)) {
					return res.status(400).json({
						message: `Campo inválido em orderBy. Permitidos: ${validFields.join(
							", "
						)}.`,
					});
				}

				if (dir !== "ASC" && dir !== "DESC") {
					return res.status(400).json({
						message: "Direção inválida em orderBy. Use 'ASC' ou 'DESC'.",
					});
				}

				// === aqui a mágica: monta o array que o Sequelize espera ===
				orderClause = [[rawField as Field, dir]];
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

	async search(req: Request, res: Response, next: NextFunction) {
		try {
			const filters = req.body;

			const { message, status, data } = await this.service.search(filters);
			return res.status(status ?? 200).json({ message, data });
		} catch (error) {
			next(error);
		}
	}
}

export default MeasureController;
