"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("device_claim", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			deviceId: {
				type: Sequelize.UUID,
				allowNull: true,
				references: {
					model: "device",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
				field: "device_id",
			},
			codeHash: {
				type: Sequelize.STRING(255),
				allowNull: false,
				unique: true,
				field: "code_hash",
			},
			status: {
				type: Sequelize.ENUM("issued", "redeemed", "expired", "revoked"),
				allowNull: false,
				defaultValue: "issued",
			},
			expiresAt: {
				type: Sequelize.DATE,
				allowNull: true,
				field: "expires_at",
			},
			issuedByUserId: {
				type: Sequelize.UUID,
				allowNull: true,
				references: {
					model: "user",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
				field: "issued_by_user_id",
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				field: "created_at",
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				field: "updated_at",
			},
		});

		// Índices
		await queryInterface.addIndex("device_claim", ["device_id"]);
		await queryInterface.addIndex("device_claim", ["status"]);
		await queryInterface.addIndex("device_claim", ["expires_at"]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex("device_claim", ["device_id"]);
		await queryInterface.removeIndex("device_claim", ["status"]);
		await queryInterface.removeIndex("device_claim", ["expires_at"]);
		await queryInterface.dropTable("device_claim");
		await queryInterface.sequelize.query(
			"DROP TYPE IF EXISTS enum_device_claim_status;"
		);
	},
};
