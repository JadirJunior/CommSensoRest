"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("tenant", {
			id: {
				type: Sequelize.DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: Sequelize.UUIDV4,
			},
			slug: {
				type: Sequelize.DataTypes.STRING(120),
				allowNull: false,
				unique: true,
				defaultValue: "default",
			},
			name: {
				type: Sequelize.DataTypes.STRING(256),
				allowNull: false,
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
	},

	async down(queryInterface) {
		await queryInterface.dropTable("tenant");
	},
};
