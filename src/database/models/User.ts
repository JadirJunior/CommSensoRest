import { DataTypes, Model } from "sequelize";
import db from ".";

class User extends Model {
	declare id: string;
	declare username: string;
	declare password: string;
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: "user",
		timestamps: false,
	}
);

export default User;
