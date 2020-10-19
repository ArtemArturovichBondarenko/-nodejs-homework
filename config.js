require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  databaseName: process.env.MONGODB_URL,
  bcryptSalt: process.env.BCRYPT_SALT_ROUNDS,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  email: process.env.EMAIL,
  jwtSecret: process.env.JWT_SECRET,
};
