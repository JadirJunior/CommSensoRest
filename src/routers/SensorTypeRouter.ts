import { Router } from "express";
import SensorTypeController from "../controllers/SensorTypeController";
import SensorTypeService from "../services/SensorTypeService";
import { authenticateAdmin } from "../middlewares/authenticate";
import registry from "../registry";

const control = new SensorTypeController(
	registry.resolve("SensorTypeService") as SensorTypeService
);

const sensorTypeRouter = Router();

sensorTypeRouter.get("/sensores", control.getAll.bind(control));
sensorTypeRouter.post(
	"/sensores",
	authenticateAdmin,
	control.create.bind(control)
);
sensorTypeRouter.delete(
	"/sensores/:id",
	authenticateAdmin,
	control.deleteById.bind(control)
);
sensorTypeRouter.patch(
	"/sensores/:id",
	authenticateAdmin,
	control.updateById.bind(control)
);

export default sensorTypeRouter;
