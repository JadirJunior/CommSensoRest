import { Router } from "express";
import MeasureController from "../controllers/MeasureController";
import MeasureService from "../services/MeasureService";
import { verifyBrokerToken } from "../middlewares/verifyBrokerToken";
import registry from "../registry";
import { authenticateUser } from "../middlewares/authenticate";

const control = new MeasureController(
	registry.resolve("MeasureService") as MeasureService
);

const measureRouter = Router();

measureRouter.get("/measure", control.list.bind(control));
measureRouter.get(
	"/last-measures/:containerId",
	authenticateUser,
	control.lastMeasuresByContainer.bind(control)
);
measureRouter.post("/measure/search", control.getAll.bind(control));
measureRouter.post("/measure", verifyBrokerToken, control.create.bind(control));
measureRouter.delete("/measure/:id", control.deleteById.bind(control));

export default measureRouter;
