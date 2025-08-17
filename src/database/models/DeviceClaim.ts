import { DataTypes, Model } from "sequelize";
import db from ".";
import Device from "./Device";
import User from "./User";

class DeviceClaim extends Model {
	declare id: string;
	declare deviceId: string | null;
	declare codeHash: string;
	declare status: "issued" | "redeemed" | "expired" | "revoked";
	declare expiresAt: Date | null;
	declare issuedByUserId: string | null;
	declare createdAt: Date;
	declare updatedAt: Date;
}
DeviceClaim.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		deviceId: { type: DataTypes.UUID, allowNull: true, field: "device_id" },
		codeHash: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: "code_hash",
		},
		status: {
			type: DataTypes.ENUM("issued", "redeemed", "expired", "revoked"),
			allowNull: false,
			defaultValue: "issued",
		},
		expiresAt: { type: DataTypes.DATE, allowNull: true, field: "expires_at" },
		issuedByUserId: {
			type: DataTypes.UUID,
			allowNull: true,
			field: "issued_by_user_id",
		},
		// REMOVIDOS: createdAt/updatedAt dos atributos
	},
	{
		sequelize: db,
		tableName: "device_claim",
		underscored: true,
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		indexes: [
			{ fields: ["device_id"] },
			{ fields: ["status"] },
			{ fields: ["expires_at"] },
		],
	}
);

DeviceClaim.belongsTo(Device, { foreignKey: "deviceId", as: "device" });
Device.hasMany(DeviceClaim, { foreignKey: "deviceId", as: "claims" });

DeviceClaim.belongsTo(User, { foreignKey: "issuedByUserId", as: "issuedBy" });
User.hasMany(DeviceClaim, { foreignKey: "issuedByUserId", as: "issuedClaims" });

export default DeviceClaim;
