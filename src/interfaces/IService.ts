import { Attributes, CreationAttributes, Model, WhereOptions } from "sequelize";
import { CommSensoResponse } from "../utils/CommSensoResponse";

export interface IService<
	M extends Model,
	CreateInput = CreationAttributes<M>
> {
	add(model: CreateInput): Promise<CommSensoResponse<M>>;

	deleteById(
		id: WhereOptions<Attributes<M>>
	): Promise<CommSensoResponse<number>>;

	getAll(): Promise<CommSensoResponse<M[]>>;

	getById(id: string): Promise<CommSensoResponse<M>>;

	update(
		id: WhereOptions<Attributes<M>>,
		attributes: {
			[key in keyof Omit<Attributes<M>, "id">]?: Omit<Attributes<M>, "id">[key];
		}
	): Promise<CommSensoResponse<number>>;
}
