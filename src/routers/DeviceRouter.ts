import { Router } from "express";

import DeviceController from "../controllers/DeviceController";
import DeviceService from "../services/DeviceService";
import {
	authenticateAdmin,
	authenticateUser,
} from "../middlewares/authenticate";
import DeviceClaim from "../database/models/DeviceClaim";
import registry from "../registry";

const control = new DeviceController(
	registry.resolve("DeviceService") as DeviceService
);

const deviceRouter = Router();

deviceRouter.get("/device", authenticateUser, control.getAll.bind(control));
deviceRouter.post("/device", authenticateAdmin, control.create.bind(control));
deviceRouter.post(
	"/device/redeem",
	authenticateUser,
	control.redeemDevice.bind(control)
);

export default deviceRouter;
