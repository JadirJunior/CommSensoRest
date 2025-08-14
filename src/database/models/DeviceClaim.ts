import { DataTypes, Model } from "sequelize";
import db from ".";
import Device from "./Device";
import User from "./User";

class DeviceClaim extends Model {
	declare id: string;
	declare deviceId: string | null;
	declare codeHash: string;
	declare salt: string | null;
	declare type: "provision" | "rekey" | "reset" | "generic";
	declare status: "issued" | "redeemed" | "expired" | "revoked";
	declare maxUses: number;
	declare uses: number;
	declare expiresAt: Date | null;
	declare issuedByUserId: string | null;
	declare redeemedByDeviceId: string | null;
	declare metadata: Record<string, any> | null;
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
		salt: { type: DataTypes.STRING(255), allowNull: true },
		type: {
			type: DataTypes.ENUM("provision", "rekey", "reset", "generic"),
			allowNull: false,
			defaultValue: "provision",
		},
		status: {
			type: DataTypes.ENUM("issued", "redeemed", "expired", "revoked"),
			allowNull: false,
			defaultValue: "issued",
		},
		maxUses: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
			field: "max_uses",
		},
		uses: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
		expiresAt: { type: DataTypes.DATE, allowNull: true, field: "expires_at" },
		issuedByUserId: {
			type: DataTypes.UUID,
			allowNull: true,
			field: "issued_by_user_id",
		},
		redeemedByDeviceId: {
			type: DataTypes.UUID,
			allowNull: true,
			field: "redeemed_by_device_id",
		},
		metadata: { type: DataTypes.JSONB, allowNull: true },
		createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
		updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
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
			{ fields: ["type"] },
			{ fields: ["expires_at"] },
		],
	}
);

DeviceClaim.belongsTo(Device, { foreignKey: "deviceId", as: "device" });
Device.hasMany(DeviceClaim, { foreignKey: "deviceId", as: "claims" });

DeviceClaim.belongsTo(User, { foreignKey: "issuedByUserId", as: "issuedBy" });
DeviceClaim.belongsTo(Device, {
	foreignKey: "redeemedByDeviceId",
	as: "redeemedByDevice",
});

export default DeviceClaim;
