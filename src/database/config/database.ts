import "dotenv/config";
import { Options } from "sequelize";

const {
	DATABASE_HOST,
	DATABASE_PORT,
	DATABASE_USERNAME,
	DATABASE_PASSWORD,
	DATABASE,
} = process.env;

const config: Options = {
	username: DATABASE_USERNAME || "postgres",
	password: DATABASE_PASSWORD || "admin",
	database: DATABASE || "commsensodb",
	host: DATABASE_HOST || "localhost",
	port: Number(DATABASE_PORT) || 5432,
	dialect: "postgres",
};

export = config;
