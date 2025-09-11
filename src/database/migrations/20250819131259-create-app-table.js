"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("app", {
			id: {
				type: Sequelize.DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: Sequelize.UUIDV4,
			},
			tenant_id: {
				type: Sequelize.DataTypes.UUID,
				allowNull: false,
				references: { model: "tenant", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},

			// Temporário
			user_id: {
				type: Sequelize.DataTypes.UUID,
				allowNull: true,
				references: { model: "user", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			slug: {
				type: Sequelize.DataTypes.STRING(120),
				allowNull: false,
			},
			name: {
				type: Sequelize.DataTypes.STRING(256),
				allowNull: false,
				defaultValue: "",
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DataTypes.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DataTypes.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// índice único (tenant_id, slug)
		await queryInterface.addIndex("app", ["tenant_id", "slug"], {
			unique: true,
			name: "app_tenant_id_slug_unique",
		});

		// UNIQUE (tenant_id, id) — necessário para a FK composta do device
		await queryInterface.addConstraint("app", {
			fields: ["tenant_id", "id"],
			type: "unique",
			name: "ux_app_tenant_id_id",
		});
	},

	async down(queryInterface) {
		await queryInterface.removeConstraint("app", "ux_app_tenant_id_id");
		await queryInterface.removeIndex("app", "app_tenant_id_slug_unique");
		await queryInterface.dropTable("app");
	},
};
