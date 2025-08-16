"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("device", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING(120),
				allowNull: false,
			},
			macAddress: {
				type: Sequelize.STRING(12),
				allowNull: false,
				unique: true,
				field: "mac_address",
			},
			mqttClientId: {
				type: Sequelize.STRING(64),
				allowNull: false,
				unique: true,
				field: "mqtt_client_id",
			},
			status: {
				type: Sequelize.ENUM("provisioned", "active", "blocked"),
				allowNull: false,
				defaultValue: "provisioned",
			},
			activatedAt: {
				type: Sequelize.DATE,
				allowNull: true,
				field: "activated_at",
			},
			blockedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				field: "blocked_at",
			},
			ownerUserId: {
				type: Sequelize.UUID,
				allowNull: true,
				field: "owner_user_id",
				references: {
					model: "user",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		});

		// Índices para as colunas
		await queryInterface.addIndex("device", ["mac_address"]);
		await queryInterface.addIndex("device", ["mqtt_client_id"]);
		await queryInterface.addIndex("device", ["status"]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex("device", ["mac_address"]);
		await queryInterface.removeIndex("device", ["mqtt_client_id"]);
		await queryInterface.removeIndex("device", ["status"]);
		await queryInterface.dropTable("device");
		await queryInterface.sequelize.query(
			"DROP TYPE IF EXISTS enum_device_status;"
		);
	},
};
