import { NextFunction, Request, Response } from "express";
import ContainerService from "../services/ContainerService";
import { BaseController } from "../base/BaseController";
import Container from "../database/models/Container";

class ContainerController extends BaseController<Container> {
    protected readonly service: ContainerService


    constructor(service: ContainerService) {
        super(service)
        this.service = service
    }

    async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const attributes = req.body;
            const { message, status } = await this.service.update({ id }, attributes)
            res.status(status ?? 200).json({message})

        } catch (error) {
            next(error)
        }
    }


}

export default ContainerController