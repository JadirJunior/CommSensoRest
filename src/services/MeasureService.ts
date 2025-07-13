import { ModelStatic, Op } from "sequelize";
import Measure from "../database/models/Measure";
import { BaseService } from "../base/BaseService";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import Container from "../database/models/Container";
import SensorType from "../database/models/SensorType";
import dayjs from "dayjs";

class MeasureService extends BaseService<Measure> {
	protected model: ModelStatic<Measure> = Measure;

	constructor() {
		super(Measure);
	}

	public async getAll(attributes?: any): Promise<CommSensoResponse<Measure[]>> {
		const where = attributes.where;

		var whereAdds = {};

		if (where) {
			if (where.dtMeasure) {
				where.dtMeasure = new Date(where.dtMeasure);

				whereAdds = {
					...whereAdds,
					dtMeasure: where.dtMeasure,
				};
			}

			if (where.container) {
				whereAdds = {
					...whereAdds,
					"$container.name$": where.container,
				};
			}

			if (where.sensor) {
				whereAdds = {
					...whereAdds,
					"$sensor.name$": where.sensor,
				};
			}
		}

		if (attributes.startDate) {
			whereAdds = {
				...whereAdds,
				dtMeasure: {
					[Op.gte]: attributes.startDate,
				},
			};
		}

		if (attributes.endDate) {
			whereAdds = {
				...whereAdds,
				dtMeasure: {
					[Op.lte]: attributes.endDate,
				},
			};
		}

		if (
			attributes.startDate &&
			attributes.endDate &&
			dayjs(attributes.startDate).isAfter(dayjs(attributes.endDate))
		) {
			return new CommSensoResponse<Measure[]>({
				data: [],
				status: 400,
				message: "Start date cannot be after end date",
			});
		}

		const result = await this.model.findAll({
			attributes: ["id", "value", "dtMeasure"],
			include: [
				{
					model: Container,
					as: "container",
					attributes: ["id", "name", "weigth", "valid"],
				},

				{
					model: SensorType,
					as: "sensor",
					attributes: ["id", "name", "unit"],
				},
			],

			limit: attributes.limit ? Number(attributes.limit) : 10,
			offset: attributes.offset ? Number(attributes.offset) : 0,

			where: whereAdds,

			order: attributes.orderBy,
		});

		return new CommSensoResponse<Measure[]>({
			data: result,
			status: 200,
			message: "Listed with successful",
		});
	}

	public async search(filters?: any): Promise<CommSensoResponse<Measure[]>> {
		const where: any = {};

		// if (filters) {
		// 	if (filters.dtMeasure) {
		// 		where.dtMeasure = new Date(filters.dtMeasure);
		// 	}

		// 	if (filters.container) {
		// 		where.containerId = filters.container;
		// 	}

		// 	if (filters.sensor) {
		// 		where.sensorId = filters.sensor;
		// 	}
		// }

		// const result = await this.model.findAll({
		// 	where,
		// 	include: [
		// 		{
		// 			model: Container,
		// 			as: "container",
		// 			attributes: ["id", "name", "weigth", "valid"],
		// 		},
		// 		{
		// 			model: SensorType,
		// 			as: "sensor",
		// 			attributes: ["id", "name", "unit"],
		// 		},
		// 	],
		// });

		return new CommSensoResponse<Measure[]>({
			data: [],
			status: 200,
			message: "Not implemented yet",
		});
	}
}

export default MeasureService;
