import { Attributes, CreationAttributes, Model, ModelStatic, WhereOptions } from "sequelize";
import { IService } from "../interfaces/IService";
import { CommSensoResponse } from "../utils/CommSensoResponse";


export abstract class BaseService<M extends Model> implements IService<M> {
    
    protected readonly model: ModelStatic<M>

    protected constructor(model: ModelStatic<M>) {
        this.model = model
    }

    public async add(attributes: CreationAttributes<M>): Promise<CommSensoResponse<M>> {
        const result = await this.model.create({ ...attributes })

        return new CommSensoResponse<M>({ data: result, status: 201, message: 'Created with successful' });
    }

    public async deleteById(where: WhereOptions<Attributes<M>>): Promise<CommSensoResponse<number>> {
        const result = await this.model.destroy({ where });

        return new CommSensoResponse<number>({ data: result, status: 200, message: 'Deleted with successful' });
    }

    public async getAll(attributes ?: any): Promise<CommSensoResponse<M[]>> {
        
        const result = await this.model.findAll(attributes)

        return new CommSensoResponse<M[]>({ data: result, status: 200, message: 'Listed with successful' });
    }

    public async getById(id: number): Promise<CommSensoResponse<M>> {
        const result = await this.model.findByPk(id)

        if (!result) {
            throw new Error('Not found');
            // return new CommSensoResponse<M>({ status: 404, message: 'Not found' });
        }

        return new CommSensoResponse<M>({ data: result, status: 200, message: 'Listed with successful' });
    }

    async update(where: WhereOptions<Attributes<M>>, attributes: { [key in keyof Attributes<M>]?: Attributes<M>[key] | undefined; }): Promise<CommSensoResponse<number>> {
        const result = await this.model.update(attributes, { where }).then((result) => result[0])

        return new CommSensoResponse<number>({ data: result, status: 200, message: 'Updated with successful' });
    }

}