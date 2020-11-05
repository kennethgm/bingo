module.exports = {
    HOST: "bingo.c7u8j0hizgeo.us-east-1.rds.amazonaws.com",
    USER: "postgres",
    PASSWORD: "adminKroot1$3",
    DB: "postgres",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};