const Joi = require("joi");
const emailRule = require("../emailRule");

const validateEmail = Joi.object({
  email: emailRule,
});

module.exports = validateEmail;
