import { ModelStatic } from "sequelize";
import Measure from "../database/models/Measure";
import { BaseService } from "../base/BaseService";


class MeasureService extends BaseService<Measure> {
    protected model: ModelStatic<Measure> = Measure

    
    constructor() {
        super(Measure)
    }
}


export default MeasureService