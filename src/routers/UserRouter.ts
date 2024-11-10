import { Router } from "express";

import UserController from "../controllers/UserController";
import UserService from "../services/UserService";

const control = new UserController(new UserService());

const userRouter = Router();

userRouter.get("/users", control.getAll.bind(control));
userRouter.get("/user/:id", control.getById.bind(control));

userRouter.get("/login", control.login.bind(control));
userRouter.post("/create", control.create.bind(control));

export default userRouter;
