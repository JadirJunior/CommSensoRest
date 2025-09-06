import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/BaseController";
import Tenant from "../database/models/Tenant";
import TenantService from "../services/TenantService";
import { CommSensoResponse } from "../utils/CommSensoResponse";

class TenantController extends BaseController<Tenant> {
	protected readonly service: TenantService;

	constructor(service: TenantService) {
		super(service);
		this.service = service;
	}
}

export default TenantController;
