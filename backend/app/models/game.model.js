module.exports = (sequelize, Sequelize) => {
    const Card = sequelize.define("game", {
        name: {
            type: Sequelize.STRING
        },
        code: {
            type: Sequelize.STRING
        },
        startDate: {
            type: Sequelize.DATE
        },
        winners: {
            type: Sequelize.JSONB
        }
    });

    return Card;
};