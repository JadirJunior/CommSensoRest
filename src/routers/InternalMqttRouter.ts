import { Router } from "express";
import { verifyBrokerToken } from "../middlewares/verifyBrokerToken";
import { InternalMqttController } from "../controllers/InternalMqttController";
import { requireFields } from "../middlewares/requireFields";

const internalRouter = Router();

internalRouter.post(
	"internal/mqtt/auth",
	verifyBrokerToken,
	requireFields(["client_id", "username", "password"]),
	InternalMqttController.auth
);

export default internalRouter;
