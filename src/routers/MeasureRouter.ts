import { Router } from "express";
import MeasureController from "../controllers/MeasureController";
import MeasureService from "../services/MeasureService";

const control = new MeasureController(new MeasureService());

const measureRouter = Router();

// measureRouter.get('/measure', control.getAll.bind(control));

measureRouter.post("/measure/getAll", control.getAll.bind(control));
measureRouter.post("/measure", control.create.bind(control));
measureRouter.delete("/measure/:id", control.deleteById.bind(control));

export default measureRouter;
