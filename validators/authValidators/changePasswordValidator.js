const Joi = require("joi");
const passwordRule = require("../passwordRule");
const tokenValidator = require("./tokenValidator");

const validatePasswords = Joi.object({
  newPassword: passwordRule.required(),

  confirmPass: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Confirm password must match new password",
    "string.empty": "Confirm password is required",
  }),
});

const validateChangePassword = tokenValidator.concat(validatePasswords);

module.exports = validateChangePassword;
