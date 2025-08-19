import { DataTypes, Model } from "sequelize";
import db from ".";
import User from "./User";
import Tenant from "./Tenant";
import App from "./App";

class Device extends Model {
	declare id: string;
	declare name: string;
	declare macAddress: string;
	declare mqttClientId: string;
	declare status: "provisioned" | "active" | "blocked";
	declare activatedAt: Date | null;
	declare blockedAt: Date | null;
	declare ownerUserId: string | null;
	declare tenantId: string | null;
	declare appId: string | null;
}

Device.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING(120), allowNull: false },
		macAddress: {
			type: DataTypes.STRING(12),
			allowNull: false,
			field: "mac_address",
			unique: true, // se quiser unicidade por tenant, veja observação abaixo
		},
		mqttClientId: {
			type: DataTypes.STRING(64),
			allowNull: false,
			field: "mqtt_client_id",
			unique: true, // idem observação abaixo
		},
		tenantId: {
			type: DataTypes.UUID,
			allowNull: true, // comece true; após backfill, pode migrar para false
			field: "tenant_id",
		},
		appId: {
			type: DataTypes.UUID,
			allowNull: true, // idem
			field: "app_id",
		},
		status: {
			type: DataTypes.ENUM("provisioned", "active", "blocked"),
			allowNull: false,
			defaultValue: "provisioned",
		},
		activatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: "activated_at",
		},
		blockedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: "blocked_at",
		},
		ownerUserId: {
			type: DataTypes.UUID,
			allowNull: true,
			field: "owner_user_id",
		},
	},
	{
		sequelize: db,
		tableName: "device",
		timestamps: false,
		underscored: true,
		indexes: [
			{ unique: true, fields: ["mac_address"] },
			{ unique: true, fields: ["mqtt_client_id"] },
			{ fields: ["status"], name: "ix_device_status" },
			{ fields: ["tenant_id"], name: "ix_device_tenant_id" },
			{ fields: ["app_id"], name: "ix_device_app_id" },
			{
				unique: true,
				fields: ["owner_user_id", "name"],
				name: "ux_device_owner_name",
			},
			// Se quiser que mac/mqtt sejam únicos POR TENANT (em vez de globalmente),
			// remova os dois índices únicos globais acima e use estes dois compostos:
			// { unique: true, fields: ["tenant_id", "mac_address"], name: "ux_device_tenant_mac" },
			// { unique: true, fields: ["tenant_id", "mqtt_client_id"], name: "ux_device_tenant_mqtt" },
		],
		hooks: {
			beforeValidate(instance) {
				if (instance.macAddress) {
					const norm = instance.macAddress.replace(/:/g, "").toLowerCase();
					instance.macAddress = norm;
					if (!instance.mqttClientId) {
						instance.mqttClientId = `dev-${norm}`;
					}
				}
			},
		},
	}
);

// Associações (composite FK é aplicada na migration; aqui ficam associações simples)
Device.belongsTo(User, { foreignKey: "ownerUserId", as: "owner" });
User.hasMany(Device, { foreignKey: "ownerUserId", as: "devices" });

Device.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });
Tenant.hasMany(Device, { foreignKey: "tenantId", as: "devices" });

Device.belongsTo(App, { foreignKey: "appId", as: "app" });
App.hasMany(Device, { foreignKey: "appId", as: "devices" });

export default Device;
