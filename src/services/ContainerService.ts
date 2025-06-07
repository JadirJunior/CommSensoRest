import { ModelStatic } from "sequelize";
import Container from "../database/models/Container";
import { BaseService } from "../base/BaseService";
import { CommSensoResponse } from "../utils/CommSensoResponse";


class ContainerService extends BaseService<Container> {
    protected model: ModelStatic<Container> = Container

    
    constructor() {
        super(Container)
    }

    public async getByName(name: string): Promise<CommSensoResponse<Container>> {

        const result = await this.model.findOne({
            where: { name }
        })

        return new CommSensoResponse<Container>({ data: result ?? undefined, status: 200, message: 'Request with successful' });

    }
}


export default ContainerService