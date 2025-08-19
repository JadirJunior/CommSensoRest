import { BaseController } from "../base/BaseController";
import App from "../database/models/App";
import AppService from "../services/AppService";

class AppController extends BaseController<App> {
	protected readonly service: AppService;

	constructor(service: AppService) {
		super(service);
		this.service = service;
	}
}

export default AppController;
