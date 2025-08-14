import { DataTypes, Model } from "sequelize";
import db from ".";
import Container from "./Container";
import SensorType from "./SensorType";
import Device from "./Device";

class Measure extends Model {
	//Use CamelCase to define the attributes
	declare id: number;
	declare value: number;
	declare dtMeasure: Date;
	declare sensorId: number;
	declare containerId: number;
	declare deviceId: string | null;
}

Measure.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		value: {
			type: DataTypes.DECIMAL(5, 2),
			allowNull: false,
		},

		dtMeasure: {
			type: DataTypes.DATE,
			allowNull: false,
		},

		sensorId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},

		containerId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		deviceId: {
			type: DataTypes.UUID,
			allowNull: true,
			field: "device_id",
		},
	},
	{
		sequelize: db,
		tableName: "measure",
		timestamps: false,
		underscored: true,
	}
);

//Relationships between container, measure, sensorType and device

Measure.belongsTo(Container, {
	foreignKey: "containerId",
	as: "container",
});

Measure.belongsTo(SensorType, {
	foreignKey: "sensorId",
	as: "sensor",
});

Measure.belongsTo(Device, {
	foreignKey: "deviceId",
	as: "device",
});

export default Measure;
