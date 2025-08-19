import { Router } from "express";
import ContainerController from "../controllers/ContainerController";
import ContainerService from "../services/ContainerService";
import { authenticateAdmin } from "../middlewares/authenticate";

const control = new ContainerController(new ContainerService());

const containerRouter = Router();

containerRouter.get("/container", control.getAll.bind(control));
containerRouter.post(
	"/container",
	authenticateAdmin,
	control.create.bind(control)
);
containerRouter.delete(
	"/container/:id",
	authenticateAdmin,
	control.deleteById.bind(control)
);
containerRouter.patch(
	"/container/:id",
	authenticateAdmin,
	control.updateById.bind(control)
);

export default containerRouter;
