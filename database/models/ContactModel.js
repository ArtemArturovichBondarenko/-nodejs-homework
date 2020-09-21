const mongoose = require("mongoose");
const joi = require("joi");

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    validate: {
      validator(email) {
        const { error } = joi.string().email().validate(email);

        if (error) throw new Error("Email not vlid");
      },
    },
  },
  phone: { type: Number, unique: true, required: true },
  subscription: { type: String },
  password: { type: String },
  tokens: [
    {
      token: { type: String, require: true },
      expires: { type: Date, require: true },
    },
  ],
});

module.exports = mongoose.model("Contact", ContactSchema);
