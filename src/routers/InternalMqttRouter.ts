import { Router } from "express";
import { verifyBrokerToken } from "../middlewares/verifyBrokerToken";
import { InternalMqttController } from "../controllers/InternalMqttController";
import { requireFields } from "../middlewares/requireFields";

const control = new InternalMqttController();

const internalRouter = Router();

internalRouter.post(
	"/internal/mqtt/auth-device",
	verifyBrokerToken,
	requireFields(["client_id", "username", "password"]),
	control.authDevice.bind(control)
);

internalRouter.post(
	"/internal/mqtt/auth-app",
	verifyBrokerToken,
	requireFields(["username", "token"]),
	control.authApp.bind(control)
);

internalRouter.post(
	"/internal/mqtt/authorize",
	verifyBrokerToken,
	requireFields(["token", "action", "topic"]),
	control.authorize.bind(control)
);

export default internalRouter;
