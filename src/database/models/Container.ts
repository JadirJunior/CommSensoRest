import { DataTypes, Model } from "sequelize";
import db from ".";

class Container extends Model {
	declare id: number;
	declare name: string;
	declare valid: boolean;
	declare weight: number;
	declare appId?: string | null;
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

		weight: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		appId: {
			type: DataTypes.UUID,
			allowNull: true,
			field: "app_id",
		},
	},
	{
		sequelize: db,
		tableName: "container",
		timestamps: false,
	}
);

export default Container;
