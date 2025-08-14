"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("measure", "device_id", {
			type: Sequelize.UUID,
			allowNull: true,
			references: { model: "device", key: "id" },
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});

		await queryInterface.addIndex("measure", ["device_id"]);
		await queryInterface.addIndex("measure", ["device_id", "dt_measure"]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex("measure", ["device_id", "dt_measure"]);
		await queryInterface.removeIndex("measure", ["device_id"]);
		await queryInterface.removeColumn("measure", "device_id");
	},
};
