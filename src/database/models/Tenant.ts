import { DataTypes, Model } from "sequelize";
import db from ".";

class Tenant extends Model {
	declare id: string;
	declare slug: string;
	declare name: string;
	declare createdAt: Date;
}

Tenant.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		slug: {
			type: DataTypes.STRING(120),
			allowNull: false,
			unique: true,
			defaultValue: "default",
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: "name",
		},
	},
	{
		sequelize: db,
		tableName: "tenant",
		timestamps: true,
		underscored: true,
	}
);

export default Tenant;
