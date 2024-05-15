import 'dotenv/config'
import { Options } from 'sequelize';	

const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE,
} = process.env;

const config: Options  = {
    username:  DATABASE_USERNAME || 'root',
    password: undefined,
    database: DATABASE || 'dbcommsenso',
    host: DATABASE_HOST || 'localhost',
    port: Number(DATABASE_PORT) || 3307,
    dialect: 'mysql'
}

export = config;