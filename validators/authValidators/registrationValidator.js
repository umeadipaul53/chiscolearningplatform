const Joi = require("joi");
const passwordRule = require("../passwordRule");
const emailRule = require("../emailRule");

const validateUserRegistration = Joi.object({
  email: emailRule,
  password: passwordRule.required(),
  name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]+([ '-][A-Za-z]+)*$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.pattern.base":
        "Full name may contain letters, spaces, hyphens, or apostrophes.",
      "string.empty": "Full name is required.",
      "string.min": "Full name must be at least 3 characters long.",
      "string.max": "Full name must be less than or equal to 50 characters.",
    }),
  phone: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid international number.",
      "string.empty": "Phone number is required.",
    }),
  role: Joi.string().valid("student", "instructor", "admin").default("student"),
});

module.exports = validateUserRegistration;
