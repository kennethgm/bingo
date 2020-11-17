'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'games',
            'zoomLink', {
                type: Sequelize.STRING
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'games',
            'zoomLink', {
                type: Sequelize.STRING
            }
        );
    }
};