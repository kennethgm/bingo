'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'games',
            'eventDate', {
                type: Sequelize.STRING
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'games',
            'eventDate', {
                type: Sequelize.STRING
            }
        );
    }

};