const mongoose = require("mongoose");
const Joi = require("joi");

const validateResendOTP = Joi.object({
  userId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
    .required(),
});

module.exports = validateResendOTP;
