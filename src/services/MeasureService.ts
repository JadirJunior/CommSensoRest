import { ModelStatic } from "sequelize";
import Measure from "../database/models/Measure";
import { BaseService } from "../base/BaseService";
import { CommSensoResponse } from "../utils/CommSensoResponse";
import Container from "../database/models/Container";
import SensorType from "../database/models/SensorType";


class MeasureService extends BaseService<Measure> {
    protected model: ModelStatic<Measure> = Measure

    
    constructor() {
        super(Measure)
    }

    public async getAll(attributes ?: any): Promise<CommSensoResponse<Measure[]>> {

        const where = attributes.where;

        var whereAdds = {}

        if (where) {
            
            if (where.dtMeasure) {
                where.dtMeasure = new Date(where.dtMeasure);


                whereAdds = {
                    ...whereAdds,
                    dtMeasure: where.dtMeasure
                }
            }

            if (where.container) {
                whereAdds = {
                    ...whereAdds,
                    '$container.name$': where.container
                }
            }

            if (where.sensor) { 
                whereAdds = {
                    ...whereAdds,
                    '$sensor.name$': where.sensor
                }
            }
        }
        

        const result = await this.model.findAll({
            attributes: ['id', 'value', 'dtMeasure'],
            include: [
                {
                    model: Container,
                    as: 'container',
                    attributes: ['id', 'name', 'quality']
                },
    
                {
                    model: SensorType,
                    as: 'sensor',
                    attributes: ['id', 'name']
                }
            ],

            limit: attributes.limit ? Number(attributes.limit) : 10,
            offset: attributes.offset ? Number(attributes.offset) : 0,

            where: whereAdds
        })

        return new CommSensoResponse<Measure[]>({ data: result, status: 200, message: 'Listed with successful' });
    }

}


export default MeasureService