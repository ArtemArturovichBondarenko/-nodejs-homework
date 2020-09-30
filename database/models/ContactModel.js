const mongoose = require("mongoose");
const passwordHash = require("password-hash");
const joi = require("joi");
const jsonWebToken = require("jsonwebtoken");
const config = require("../../config");

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(email) {
        const { error } = joi.string().email().validate(email);

        if (error) throw new Error("Email not vlid");
      },
    },
  },
  password: { type: String, required: true },
  phone: { type: Number, unique: true, required: true },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  password: { type: String },
  tokens: [
    {
      token: { type: String, require: true },
      expires: { type: Date, require: true },
    },
  ],
  createdAt: { type: Date, default: () => Date.now() },
  deleteAt: Date,
});

ContactSchema.static("hashPassword", (password) => {
  return passwordHash.generate(password);
});

ContactSchema.method("isPasswordValid", function (password) {
  return password.verify(password, this.password);
});

ContactSchema.method("generateAndSaveToken", async function () {
  const token = jsonWebToken.sign({ id: this._id }, config.jwtPrivateKey);

  this.tokens.push({
    token,
    expires: new Date().getTime() + 24 * 60 * 60 * 1e3,
  });
  await this.save();

  return token;
});

ContactSchema.pre("save", function () {
  if (this.isNew) {
    this.password = this.constructor.hashPassword(this.password);
  }
});

module.exports = mongoose.model("Contact", ContactSchema);
