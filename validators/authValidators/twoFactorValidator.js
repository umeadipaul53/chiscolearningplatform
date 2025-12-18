const mongoose = require("mongoose");
const Joi = require("joi");

const validateTwoFactorInput = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
    .required(),
  code: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Code Entered must be a 6-digit number.",
    }),
});

module.exports = validateTwoFactorInput;
