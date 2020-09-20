require("dotenv").config();

module.exports = {
  databaseConnectionUrl: process.env.DATABASE_URL,
  databaseName: process.env.DATABASE_NAME,
};
