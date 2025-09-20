import { Router } from "express";
import AppController from "../controllers/AppController";
import AppService from "../services/AppService";
import { authenticateAdmin } from "../middlewares/authenticate";
import registry from "../registry";

const control = new AppController(registry.resolve("AppService") as AppService);

const appRouter = Router();

appRouter.get("/app", authenticateAdmin, control.getAll.bind(control));
appRouter.post("/app", authenticateAdmin, control.create.bind(control));
appRouter.delete(
	"/app/:id",
	authenticateAdmin,
	control.deleteById.bind(control)
);

export default appRouter;
