const mongoose = require("mongoose");
const Joi = require("joi");

const tokenValidator = Joi.object({
  token: Joi.string()
    .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/) // JWT format
    .required(),
});

module.exports = tokenValidator;
