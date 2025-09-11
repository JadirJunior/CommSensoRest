"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("device", "tenant_id", {
			type: Sequelize.DataTypes.UUID,
			allowNull: true,
			references: { model: "tenant", key: "id" },
			onUpdate: "CASCADE",
			onDelete: "RESTRICT",
		});

		await queryInterface.addColumn("device", "app_id", {
			type: Sequelize.DataTypes.UUID,
			allowNull: true,
			references: { model: "app", key: "id" },
			onUpdate: "CASCADE",
			onDelete: "RESTRICT",
		});

		await queryInterface.addColumn("container", "app_id", {
			type: Sequelize.DataTypes.UUID,
			allowNull: true,
			references: { model: "app", key: "id" },
			onUpdate: "CASCADE",
			onDelete: "RESTRICT",
		});

		await queryInterface.addIndex("device", {
			fields: ["tenant_id"],
			name: "ix_device_tenant_id",
		});
		await queryInterface.addIndex("device", {
			fields: ["app_id"],
			name: "ix_device_app_id",
		});

		await queryInterface.addConstraint("device", {
			fields: ["tenant_id", "app_id"],
			type: "foreign key",
			name: "fk_device_tenant_app_consistent",
			references: { table: "app", fields: ["tenant_id", "id"] },
			onUpdate: "CASCADE",
			onDelete: "RESTRICT",
		});
	},

	async down(queryInterface) {
		await queryInterface.removeConstraint(
			"device",
			"fk_device_tenant_app_consistent"
		);
		await queryInterface.removeIndex("device", "ix_device_tenant_id");
		await queryInterface.removeIndex("device", "ix_device_app_id");
		await queryInterface.removeColumn("device", "tenant_id");
		await queryInterface.removeColumn("device", "app_id");
	},
};
