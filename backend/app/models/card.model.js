module.exports = (sequelize, Sequelize) => {
    const Card = sequelize.define("cards", {
        name: {
            type: Sequelize.STRING
        },
        phonenumber: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        numbers: {
            type: Sequelize.JSONB
        },
        gameCode: {
            type: Sequelize.STRING
        },
        officialId: {
            type: Sequelize.STRING
        }
    });

    return Card;
};