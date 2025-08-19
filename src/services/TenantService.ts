import { ModelStatic } from "sequelize";
import { BaseService } from "../base/BaseService";
import Tenant from "../database/models/Tenant";

type CreateTenantDTO = {
	slug: string;
	name: string;
};

class TenantService extends BaseService<Tenant, CreateTenantDTO> {
	protected model: ModelStatic<Tenant> = Tenant;

	constructor() {
		super(Tenant);
	}
}

export default TenantService;
