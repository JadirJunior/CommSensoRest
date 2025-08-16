import { Router } from "express";

import DeviceController from "../controllers/DeviceController";
import DeviceService from "../services/DeviceService";
import {
	authenticateAdmin,
	authenticateUser,
} from "../middlewares/authenticate";

const control = new DeviceController(new DeviceService());

const deviceRouter = Router();

deviceRouter.get("/device", authenticateUser, control.getAll.bind(control));
deviceRouter.post("/device", authenticateAdmin, control.create.bind(control));

export default deviceRouter;
