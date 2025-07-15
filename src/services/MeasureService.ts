import { col, fn, ModelStatic, Op, where } from "sequelize";
import Measure from "../database/models/Measure";
import { BaseService } from "../base/BaseService";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import Container from "../database/models/Container";
import SensorType from "../database/models/SensorType";
import dayjs from "dayjs";
import { GetMeasureResponse } from "../utils/dto/types";

interface GetAllMeasuresFilters {
	limit?: number;
	offset?: number;
	orderBy?: any;
	container?: string;
	sensor?: string;
	startDate?: string;
	endDate?: string;
}

interface MeasureWithAssociations extends Measure {
	sensor: SensorType;
	container: Container;
}

class MeasureService extends BaseService<Measure> {
	protected model: ModelStatic<Measure> = Measure;

	constructor() {
		super(Measure);
	}

	public async list(
		filters: GetAllMeasuresFilters
	): Promise<CommSensoResponse<GetMeasureResponse[]>> {
		if (
			filters.startDate &&
			filters.endDate &&
			dayjs(filters.startDate).isAfter(dayjs(filters.endDate))
		) {
			return new CommSensoResponse<GetMeasureResponse[]>({
				data: [],
				status: 400,
				message: "A data inicial não pode ser posterior à data final.",
			});
		}

		const whereClause: any = {};
		if (filters.container) {
			whereClause["$container.name$"] = filters.container;
		}
		if (filters.sensor) {
			const sensorNames = filters.sensor.split(",").map((s) =>
				s
					.trim()
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.toLowerCase()
			);

			whereClause[Op.or] = sensorNames.map((name) =>
				where(fn("unaccent", fn("LOWER", col("sensor.name"))), name)
			);
		}

		const dateConditions: any = {};
		if (filters.startDate) {
			dateConditions[Op.gte] = dayjs(filters.startDate)
				.startOf("day")
				.toISOString();
		}
		if (filters.endDate) {
			dateConditions[Op.lte] = dayjs(filters.endDate)
				.endOf("day")
				.toISOString();
		}

		if (dateConditions[Op.gte] || dateConditions[Op.lte]) {
			whereClause.dtMeasure = dateConditions;
		}

		const includeOptions = [
			{
				model: Container,
				as: "container",
				attributes: ["id", "name", "weigth", "valid"],
				required: !!filters.container,
			},
			{
				model: SensorType,
				as: "sensor",
				attributes: ["id", "name", "unit"],
				required: !!filters.sensor,
			},
		];

		const result = await (
			this.model as ModelStatic<MeasureWithAssociations>
		).findAll({
			attributes: ["id", "value", "dtMeasure"],
			include: includeOptions,
			where: whereClause,
			limit: filters.limit ? Number(filters.limit) : 10,
			offset: filters.offset ? Number(filters.offset) : 0,
			order: filters.orderBy,
		});

		const total = await this.model.count({
			where: whereClause,
			include: includeOptions,
			distinct: true,
		});

		const formattedData: GetMeasureResponse[] = result.map((measure) => ({
			id: measure.id,
			value: measure.value,
			dtMeasure: measure.dtMeasure.toISOString(),
			sensor: {
				id: measure.sensor.id,
				name: measure.sensor.name,
				unit: measure.sensor.unit,
			},
			container: {
				id: measure.container.id,
				name: measure.container.name,
				weight: measure.container.weight,
				valid: measure.container.valid,
			},
		}));

		return new CommSensoResponse<GetMeasureResponse[]>({
			data: formattedData,
			total: total,
			status: 200,
			message: "Medições listadas com sucesso.",
		});
	}
}

export default MeasureService;
