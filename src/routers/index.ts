import { Router } from "express";
import sensorTypeRouter from "./SensorTypeRouter";
import containerRouter from "./ContainerRouter";
import MeasureRouter from "./MeasureRouter";
import userRouter from "./UserRouter";
import deviceRouter from "./DeviceRouter";
import deviceClaimRouter from "./DeviceClaimRouter";
import internalRouter from "./InternalMqttRouter";
import tenantRouter from "./TenantRouter";
import appRouter from "./AppRouter";

const router = Router();

router.use(containerRouter);
router.use(sensorTypeRouter);
router.use(MeasureRouter);
router.use(userRouter);
router.use(deviceRouter);
router.use(deviceClaimRouter);
router.use(tenantRouter);
router.use(appRouter);
router.use(internalRouter);

export default router;
