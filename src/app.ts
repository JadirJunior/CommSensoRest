import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import router from "./routers";

const app = express();

app.use(morgan("tiny"));

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(router);

app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404).send({ message: "Not Found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	return res.status(500).send({ message: err.message });
	next();
});

export default app;
