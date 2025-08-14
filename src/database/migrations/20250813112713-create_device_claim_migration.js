"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("device_claim", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal("gen_random_uuid()"),
				primaryKey: true,
			},
			device_id: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "device", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			code_hash: {
				type: Sequelize.STRING(255),
				allowNull: false,
				unique: true,
			},
			salt: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			type: {
				type: Sequelize.ENUM("provision", "rekey", "reset", "generic"),
				allowNull: false,
				defaultValue: "provision",
			},
			status: {
				type: Sequelize.ENUM("issued", "redeemed", "expired", "revoked"),
				allowNull: false,
				defaultValue: "issued",
			},
			max_uses: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			uses: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			expires_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			issued_by_user_id: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "user", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			redeemed_by_device_id: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "device", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			metadata: {
				type: Sequelize.JSONB,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("now"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("now"),
			},
		});

		await queryInterface.addIndex("device_claim", ["device_id"]);
		await queryInterface.addIndex("device_claim", ["status"]);
		await queryInterface.addIndex("device_claim", ["type"]);
		await queryInterface.addIndex("device_claim", ["expires_at"]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex("device_claim", ["device_id"]);
		await queryInterface.removeIndex("device_claim", ["status"]);
		await queryInterface.removeIndex("device_claim", ["type"]);
		await queryInterface.removeIndex("device_claim", ["expires_at"]);
		await queryInterface.dropTable("device_claim");
		await queryInterface.sequelize.query(
			"DROP TYPE IF EXISTS enum_device_claim_type;"
		);
		await queryInterface.sequelize.query(
			"DROP TYPE IF EXISTS enum_device_claim_status;"
		);
	},
};
