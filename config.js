require("dotenv").config();
const path = require("path");

module.exports = {
  databaseConnectionUrl: process.env.DATABASE_URL,
  databaseName: process.env.DATABASE_NAME,
  jwtPrivateKey: process.env.TOKEN_PRIVATE_KEY,

  path: {
    files: path.join(__dirname, "./public/images"),
    tmp: path.join(__dirname, "./tmp"),
  },
};
