import { Router } from "express";

import { authenticateAdmin } from "../middlewares/authenticate";
import DeviceClaimController from "../controllers/DeviceClaimController";
import DeviceClaimService from "../services/DeviceClaimService";

const control = new DeviceClaimController(new DeviceClaimService());

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
