import { ModelStatic } from "sequelize";
import { BaseService } from "../base/BaseService";
import App from "../database/models/App";

type CreateTenantAppDTO = {
	slug: string;
	name: string;
	tenantId: string;
};

class AppService extends BaseService<App, CreateTenantAppDTO> {
	protected model: ModelStatic<App> = App;

	constructor() {
		super(App);
	}
}

export default AppService;
