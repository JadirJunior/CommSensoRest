import { DataTypes, Model } from "sequelize";
import db from ".";

class Container extends Model {
	declare id: number;
	declare name: string;
	declare quality: string;
	declare valid: boolean;
	declare weight: number;
}

Container.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		valid: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},

		weigth: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: "container",
		timestamps: false,
	}
);

export default Container;
