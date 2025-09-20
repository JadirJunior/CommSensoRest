import { Router } from "express";

import { authenticateAdmin } from "../middlewares/authenticate";
import DeviceClaimController from "../controllers/DeviceClaimController";
import DeviceClaimService from "../services/DeviceClaimService";
import registry from "../registry";

const control = new DeviceClaimController(
	registry.resolve("DeviceClaimService") as DeviceClaimService
);

const deviceClaimRouter = Router();

deviceClaimRouter.get(
	"/device-claim",
	authenticateAdmin,
	control.getAll.bind(control)
);
deviceClaimRouter.post(
	"/device-claim/issue",
	authenticateAdmin,
	control.issueDevice.bind(control)
);

export default deviceClaimRouter;
