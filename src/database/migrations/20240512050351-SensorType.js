'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sensortype', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },


            name: {
                type: Sequelize.STRING,
                allowNull: false
            },

            unit: {
                type: Sequelize.STRING,
                allowNull: false
            }

        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('sensortype');
    }
};