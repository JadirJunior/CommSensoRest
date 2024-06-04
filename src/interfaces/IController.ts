import { NextFunction, Request, Response } from "express";


export interface IController {
    create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;

    deleteById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;

    getAll(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}