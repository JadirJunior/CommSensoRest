import { DataTypes, Model } from "sequelize";
import db from ".";
import Tenant from "./Tenant";
import User from "./User";

class App extends Model {
	declare id: string;
	declare slug: string;
	declare name: string;
	declare tenantId: string;
	declare userId: string | null; // Temporário
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
		userId: {
			type: DataTypes.UUID,
			allowNull: true,
			field: "user_id",
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

App.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });
Tenant.hasMany(App, { foreignKey: "tenantId", as: "apps" });

App.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(App, { foreignKey: "userId", as: "apps" });

export default App;
