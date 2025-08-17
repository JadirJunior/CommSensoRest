import { Router } from "express";
import sensorTypeRouter from "./SensorTypeRouter";
import containerRouter from "./ContainerRouter";
import MeasureRouter from "./MeasureRouter";
import userRouter from "./UserRouter";
import deviceRouter from "./DeviceRouter";
import deviceClaimRouter from "./DeviceClaimRouter";

const router = Router();

router.use(containerRouter);
router.use(sensorTypeRouter);
router.use(MeasureRouter);
router.use(userRouter);
router.use(deviceRouter);
router.use(deviceClaimRouter);

export default router;
