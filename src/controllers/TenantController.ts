import { BaseController } from "../base/BaseController";
import Tenant from "../database/models/Tenant";
import TenantService from "../services/TenantService";

class TenantController extends BaseController<Tenant> {
	protected readonly service: TenantService;

	constructor(service: TenantService) {
		super(service);
		this.service = service;
	}
}

export default TenantController;
