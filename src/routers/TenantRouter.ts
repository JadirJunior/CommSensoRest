import { Router } from "express";
import TenantController from "../controllers/TenantController";
import TenantService from "../services/TenantService";
import { authenticateAdmin } from "../middlewares/authenticate";

const control = new TenantController(new TenantService());

const tenantRouter = Router();

tenantRouter.get("/tenant", control.getAll.bind(control));
tenantRouter.post("/tenant", authenticateAdmin, control.create.bind(control));
tenantRouter.delete(
	"/tenant/:id",
	authenticateAdmin,
	control.deleteById.bind(control)
);

export default tenantRouter;
