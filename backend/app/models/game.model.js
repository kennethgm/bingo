module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("games", {
        name: {
            type: Sequelize.STRING
        },
        startDate: {
            type: Sequelize.DATE
        },
        winners: {
            type: Sequelize.JSONB
        },
        settings: {
            type: Sequelize.JSONB
        },
        zoomLink: {
            type: Sequelize.STRING
        }
    });

    return Game;
};