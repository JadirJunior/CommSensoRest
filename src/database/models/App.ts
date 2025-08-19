import { DataTypes, Model } from "sequelize";
import db from ".";

class App extends Model {
	declare id: string;
	declare slug: string;
	declare name: string;
	declare createdAt: Date;
}

App.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		tenantId: {
			type: DataTypes.UUID,
			allowNull: false,
			field: "tenant_id",
		},
		slug: {
			type: DataTypes.STRING(120),
			allowNull: false,
			field: "slug",
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: "name",
		},
	},
	{
		sequelize: db,
		tableName: "app",
		timestamps: true,
		underscored: true,
		indexes: [{ unique: true, fields: ["tenant_id", "slug"] }],
	}
);

export default App;
