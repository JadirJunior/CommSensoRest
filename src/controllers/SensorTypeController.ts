import { NextFunction, Request, Response } from "express";
import SensorTypeService from "../services/SensorTypeService";
import { BaseController } from "../base/BaseController";
import SensorType from "../database/models/SensorType";

class SensorTypeController extends BaseController<SensorType> {
    protected readonly service: SensorTypeService


    constructor(service: SensorTypeService) {
        super(service)
        this.service = service
    }

    async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const { message, status, data } = await this.service.update({ id }, { name })
            res.status(status ?? 200).json({message})

        } catch (error) {
            next(error)
        }
    }


}

export default SensorTypeController