import { Router } from "express";

import UserController from "../controllers/UserController";
import UserService from "../services/UserService";
import registry from "../registry";

const control = new UserController(
	registry.resolve("UserService") as UserService
);

const userRouter = Router();

userRouter.get("/users", control.getAll.bind(control));
userRouter.get("/users/:id", control.getById.bind(control));
userRouter.post("/users", control.createUser.bind(control));

userRouter.post("/users/login", control.login.bind(control));

export default userRouter;
