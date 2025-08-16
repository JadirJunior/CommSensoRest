import { DataTypes, Model } from "sequelize";
import db from ".";

class User extends Model {
	declare id: string;
	declare username: string;
	declare password: string;
	declare role: string;
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
		},

		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		role: {
			type: DataTypes.ENUM("user", "admin"),
			allowNull: false,
			defaultValue: "user",
		},
	},
	{
		sequelize: db,
		tableName: "user",
		timestamps: false,
	}
);

export default User;
