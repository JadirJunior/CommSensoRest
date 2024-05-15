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

            quality: {
                type: Sequelize.STRING,
                allowNull: false
            }

        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('container');
    }
};