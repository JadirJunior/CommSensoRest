import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/BaseController";
import Measure from "../database/models/Measure";
import MeasureService from "../services/MeasureService";
import SensorType from "../database/models/SensorType";
import Container from "../database/models/Container";

class MeasureController extends BaseController<Measure> {
    protected readonly service: MeasureService


    constructor(service: MeasureService) {
        super(service)
        this.service = service
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {

            const { value, dtMeasure, sensorId, containerId } = req.body

            const dateMeasure = new Date(dtMeasure)
            const { message, status, data } = await this.service.add({ value, dtMeasure: dateMeasure, sensorId, containerId })

            return res.status(status ?? 200).json({ message, data })

        } catch (error) {
            next(error)
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            
            const { message, status, data } = await this.service.getAll( 
                {
                    attributes: ['id', 'value', 'dtMeasure'],
                    include: [
                        {
                            model: Container,
                            as: 'container',
                            attributes: ['name', 'quality']
                        },
            
                        {
                            model: SensorType,
                            as: 'sensor',
                            attributes: ['name']
                        }
                    ]
                }
            )


            return res.status(status ?? 200).json({ message, data })
        } catch (error) {
            next(error)
        }
    }



}

export default MeasureController