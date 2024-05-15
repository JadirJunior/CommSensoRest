import { ModelStatic } from "sequelize";
import Container from "../database/models/Container";
import { BaseService } from "../base/BaseService";


class ContainerService extends BaseService<Container> {
    protected model: ModelStatic<Container> = Container

    
    constructor() {
        super(Container)
    }
}


export default ContainerService