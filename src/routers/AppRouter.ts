import { Router } from "express";
import AppController from "../controllers/AppController";
import AppService from "../services/AppService";
import { authenticateAdmin } from "../middlewares/authenticate";

const control = new AppController(new AppService());

const appRouter = Router();

appRouter.get("/app", authenticateAdmin, control.getAll.bind(control));
appRouter.post("/app", authenticateAdmin, control.create.bind(control));
appRouter.delete(
	"/app/:id",
	authenticateAdmin,
	control.deleteById.bind(control)
);

export default appRouter;
