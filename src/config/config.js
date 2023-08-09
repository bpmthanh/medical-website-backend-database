require("dotenv").config();
const dbPassword =
  process.env.DB_PASSWORD === "null" ? null : process.env.DB_PASSWORD;

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: dbPassword,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: "+07:00",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
