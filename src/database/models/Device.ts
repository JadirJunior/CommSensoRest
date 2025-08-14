import { DataTypes, Model } from "sequelize";
import db from ".";
import User from "./User";

class Device extends Model {
	declare id: string;
	declare name: string;
	declare macAddress: string;
	declare mqttClientId: string;
	declare status: "provisioned" | "registered" | "active" | "blocked";
	declare isActive: boolean;
	declare registeredAt: Date | null;
	declare lastSeenAt: Date | null;
	declare ownerUserId: string | null;
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
			unique: true,
		},
		mqttClientId: {
			type: DataTypes.STRING(64),
			allowNull: false,
			field: "mqtt_client_id",
			unique: true,
		},
		status: {
			type: DataTypes.ENUM("provisioned", "registered", "active", "blocked"),
			allowNull: false,
			defaultValue: "provisioned",
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
			field: "is_active",
		},
		registeredAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: "registered_at",
		},
		lastSeenAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: "last_seen_at",
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
			{ fields: ["status"] },
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

Device.belongsTo(User, { foreignKey: "ownerUserId", as: "owner" });

export default Device;
