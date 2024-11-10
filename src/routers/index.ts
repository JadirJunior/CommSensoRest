import { Router } from "express";
import sensorTypeRouter from "./SensorTypeRouter";
import containerRouter from "./ContainerRouter";
import MeasureRouter from "./MeasureRouter";
import userRouter from "./UserRouter";

const router = Router();

router.use(containerRouter);
router.use(sensorTypeRouter);
router.use(MeasureRouter);
router.use(userRouter);

export default router;
