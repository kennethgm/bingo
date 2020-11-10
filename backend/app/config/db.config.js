module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "adminKroot1$3",
    DB: "bingo",
    logging: console.log,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};