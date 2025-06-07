import { ModelStatic } from "sequelize";
import SensorType from "../database/models/SensorType";
import { BaseService } from "../base/BaseService";


class SensorTypeService extends BaseService<SensorType> {
    protected model: ModelStatic<SensorType> = SensorType

    
    constructor() {
        super(SensorType)
    }
}


export default SensorTypeService