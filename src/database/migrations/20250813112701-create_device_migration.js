// migrations/XXXXXXXXXXXX-create-device.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"device",
			{
				id: {
					type: Sequelize.UUID,
					defaultValue: Sequelize.UUIDV4,
					primaryKey: true,
				},
				name: { type: Sequelize.STRING(120), allowNull: false },
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
					allowNull: true,
					field: "blocked_at",
				},
				ownerUserId: {
					type: Sequelize.UUID,
					allowNull: true,
					field: "owner_user_id",
					references: { model: "user", key: "id" },
					onUpdate: "CASCADE",
					onDelete: "SET NULL",
				},
			},
			{ timestamps: false, underscored: true }
		);

		// índices únicos simples
		await queryInterface.addIndex("device", {
			fields: ["mac_address"],
			unique: true,
			name: "ux_device_mac_address",
		});

		await queryInterface.addIndex("device", {
			fields: ["mqtt_client_id"],
			unique: true,
			name: "ux_device_mqtt_client_id",
		});

		// índice normal em status
		await queryInterface.addIndex("device", {
			fields: ["status"],
			name: "ix_device_status",
		});

		// unicidade composta (owner_user_id + name)
		await queryInterface.addConstraint("device", {
			fields: ["owner_user_id", "name"],
			type: "unique",
			name: "ux_device_owner_name", // nome da constraint
		});
	},

	async down(queryInterface, Sequelize) {
		// remover a constraint composta
		await queryInterface.removeConstraint("device", "ux_device_owner_name");

		// remover índices nomeados
		await queryInterface.removeIndex("device", "ux_device_mac_address");
		await queryInterface.removeIndex("device", "ux_device_mqtt_client_id");
		await queryInterface.removeIndex("device", "ix_device_status");

		// dropar tabela
		await queryInterface.dropTable("device");

		// limpar ENUM do Postgres (se aplicável)
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_device_status";'
		);
	},
};
