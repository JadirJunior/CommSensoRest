'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('container', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },

            valid: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            weigth: {
                type: Sequelize.FLOAT,
                allowNull: false
            },

        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('container');
    }
};