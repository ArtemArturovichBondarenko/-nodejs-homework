const joi = require("joi");
const jwt = require("jsonwebtoken");
const ContactModel = require("../database/models/ContactModel");
const validate = require("../helpers/validate");
const config = require("../config");
const errorHandler = require("../helpers/error-handler");
const ApiError = require("../helpers/ApiError");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["access-token"];

    validate(joi.string().min(20).required(), token);

    const contact = await ContactModel.findOne({ "tokens.token": token });

    if (!contact) {
      throw new ApiError(401, "Not authorized");
    }

    const tokenRecord = contact.tokens.find(
      (contactToken) => contactToken.token === token
    );

    if (new Date(tokenRecord.expires) < new Date()) {
      contact.tokens = contact.tokens.filter(
        (contactToken) => contactToken.token !== token
      );

      await contact.save();

      throw new ApiError(403, "Token not valid");
    }

    jwt.decode(tokenRecord.token, config.jwtPrivateKey);

    req.contact = contact;

    next();
  } catch (e) {
    errorHandler(req, res, e);
  }
};
