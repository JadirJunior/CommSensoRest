import { Sequelize, Options } from "sequelize";
import config from "../database/config/database";

const sequelizeConnection = new Sequelize(config);

export default sequelizeConnection;
