import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/BaseController";
import Measure from "../database/models/Measure";
import MeasureService from "../services/MeasureService";
import SensorType from "../database/models/SensorType";
import Container from "../database/models/Container";
import { where } from "sequelize";

class MeasureController extends BaseController<Measure> {
    protected readonly service: MeasureService


    constructor(service: MeasureService) {
        super(service)
        this.service = service
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {

            const { value, dtMeasure, sensorId, containerId } = req.body

            const dateMeasure = new Date(dtMeasure);
            
            const { message, status, data } = await this.service.add({ value, dtMeasure: dateMeasure, sensorId, containerId })

            return res.status(status ?? 200).json({ message, data })

        } catch (error) {
            next(error)
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {

            const {limit, page, ...query} = req.query;

            const attributes = {
                limit: limit ? Number(limit) : 10,
                offset: page ? ((Number(page) - 1) * (req.query.limit ? Number(limit) : 10)) : 0,
                where: {...query}
            }

            
            const { message, status, data } = await this.service.getAll(attributes);
            return res.status(status ?? 200).json({ message, data })
        } catch (error) {
            next(error)
        }
    }



}

export default MeasureController