"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("device", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal("gen_random_uuid()"),
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING(120),
				allowNull: false,
			},
			mac_address: {
				type: Sequelize.STRING(12),
				allowNull: false,
				unique: true,
			},
			mqtt_client_id: {
				type: Sequelize.STRING(64),
				allowNull: false,
				unique: true,
			},
			status: {
				type: Sequelize.ENUM("provisioned", "registered", "active", "blocked"),
				allowNull: false,
				defaultValue: "provisioned",
			},
			is_active: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			registered_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			last_seen_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			owner_user_id: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "user", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
		});

		await queryInterface.addIndex("device", ["status"]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex("device", ["status"]);
		await queryInterface.dropTable("device");
		await queryInterface.sequelize.query(
			"DROP TYPE IF EXISTS enum_device_status;"
		);
	},
};
