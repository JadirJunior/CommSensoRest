import { Router } from "express";
import MeasureController from "../controllers/MeasureController";

const control = new MeasureController();

const measureRouter = Router();

measureRouter.get("/measure", control.list.bind(control));

measureRouter.post("/measure/search", control.getAll.bind(control));
measureRouter.post("/measure", control.create.bind(control));
measureRouter.delete("/measure/:id", control.deleteById.bind(control));

export default measureRouter;
