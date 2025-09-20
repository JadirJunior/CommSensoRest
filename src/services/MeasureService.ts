import { col, fn, ModelStatic, Op, Sequelize, where } from "sequelize";
import Measure from "../database/models/Measure";
import { BaseService } from "../base/BaseService";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import Container from "../database/models/Container";
import SensorType from "../database/models/SensorType";
import dayjs from "dayjs";
import { GetMeasureResponse } from "../utils/dto/types";
import ContainerService from "./ContainerService";
import DeviceService from "./DeviceService";
import Device from "../database/models/Device";
import UserService from "./UserService";

interface GetAllMeasuresFilters {
	limit?: number;
	offset?: number;
	orderBy?: any;
	container?: string;
	sensor?: string;
	startDate?: string;
	endDate?: string;
}

interface CreateMeasureDTO {
	value: number;
	dtMeasure: string;
	sensorId: number;
	containerId: number;
	deviceId: number;
	ctx: { id: string; role: "admin" | "user" | "broker" };
}

interface MeasureWithAssociations extends Measure {
	sensor: SensorType;
	container: Container;
}

class MeasureService extends BaseService<Measure> {
	protected model: ModelStatic<Measure> = Measure;

	constructor(
		private readonly containerService: ContainerService,
		private readonly deviceService: DeviceService,
		private readonly userService: UserService
	) {
		super(Measure);
	}

	public async createMeasure({
		containerId,
		ctx,
		deviceId,
		sensorId,
		value,
		dtMeasure,
	}: CreateMeasureDTO): Promise<CommSensoResponse<Measure>> {
		const containerResponse = await this.containerService.getById(containerId);
		const containerData = containerResponse.data;
		const foundContainerId = containerData?.id ?? -1;

		if (ctx.id !== "broker") {
			return new CommSensoResponse<Measure>({
				data: undefined,
				status: 403,
				message: "Acesso negado. Permissão insuficiente.",
			});
		}

		if (foundContainerId === -1) {
			return new CommSensoResponse<Measure>({
				data: undefined,
				status: 404,
				message: "Container não encontrado",
			});
		}

		const deviceResponse = await this.deviceService.getById(deviceId);
		const deviceData = deviceResponse.data;

		if (!deviceData) {
			return new CommSensoResponse<Measure>({
				data: undefined,
				status: 404,
				message: "Dispositivo não encontrado",
				total: 0,
			});
		}

		if (containerData?.appId !== deviceData.appId) {
			return new CommSensoResponse<Measure>({
				data: undefined,
				status: 400,
				message:
					"O container não pertence ao mesmo aplicativo que o dispositivo.",
			});
		}

		const measure = await this.add({
			value,
			dtMeasure,
			sensorId,
			containerId,
			deviceId,
		});

		return new CommSensoResponse<Measure>({
			data: measure.data,
			total: 1,
			status: 201,
			message: "Medida criada com sucesso.",
		});
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
				attributes: ["id", "name", "weight", "valid"],
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

	public async getLastMeasuresByContainerId(
		containerId: number,
		ctx: { id: string; role: "admin" | "user" | "broker" }
	): Promise<CommSensoResponse<GetMeasureResponse[]>> {
		if (ctx.role !== "admin" && ctx.role !== "user") {
			return new CommSensoResponse<GetMeasureResponse[]>({
				data: [],
				status: 403,
				message: "Acesso negado.",
				total: 0,
			});
		}

		const containerResponse = await this.containerService.getById(containerId);
		const foundContainerId = containerResponse.data?.id ?? -1;

		if (foundContainerId === -1) {
			return new CommSensoResponse<GetMeasureResponse[]>({
				data: [],
				status: 404,
				message: "Container não encontrado",
				total: 0,
			});
		}

		const user = await this.userService.getUserById(ctx.id);
		if (!user.data) {
			return new CommSensoResponse<GetMeasureResponse[]>({
				data: [],
				status: 404,
				message: "Usuário não encontrado",
				total: 0,
			});
		}

		if (
			!user.data.apps.some((app) => app.id === containerResponse.data?.appId)
		) {
			return new CommSensoResponse<GetMeasureResponse[]>({
				data: [],
				status: 403,
				message: "Acesso negado.",
				total: 0,
			});
		}

		const includeOptions = [
			{
				model: Container,
				as: "container",
				attributes: ["id", "name", "weight", "valid"],
				where: { id: containerId },
				required: true,
			},
			{
				model: SensorType,
				as: "sensor",
				attributes: ["id", "name", "unit"],
				required: true,
			},
			{
				model: Device,
				as: "device",
				attributes: ["id", "name"],
				required: true,
			},
		];

		const results = await Measure.findAll({
			include: includeOptions,
			where: {
				dt_measure: {
					[Op.eq]: Sequelize.literal(`(
        SELECT MAX(m2.dt_measure)
        FROM measure m2
        WHERE m2.sensor_id = "Measure".sensor_id
      )`),
				},
			},
		});

		const formattedData: GetMeasureResponse[] = results.map((measure) => ({
			id: measure.id,
			value: measure.value,
			dtMeasure: measure.dtMeasure.toISOString(),
			sensor: {
				id: measure.sensor?.id ?? 0,
				name: measure.sensor?.name ?? "",
				unit: measure.sensor?.unit ?? "",
			},
			container: {
				id: measure.container?.id ?? 0,
				name: measure.container?.name ?? "",
				weight: measure.container?.weight ?? 0,
				valid: measure.container?.valid ?? false,
			},
		}));

		return new CommSensoResponse<GetMeasureResponse[]>({
			data: formattedData,
			total: formattedData.length,
			status: 200,
			message: "Últimas medidas do container por sensor obtidas com sucesso.",
		});
	}
}

export default MeasureService;
