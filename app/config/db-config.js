module.exports = {
    HOST: "localhost",
    USER: "postgres",      // Set username
    PASSWORD: "11111",     // Set password
    DB: "crud",            // Set database
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};