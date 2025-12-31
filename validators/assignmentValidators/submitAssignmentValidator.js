const Joi = require("joi");

const submitAssignmentSchema = Joi.object({
  textAnswer: Joi.string()
    .trim()
    .min(5)
    .max(5000)
    .when("file", {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required().messages({
        "any.required": "Text answer is required when no file is submitted",
        "string.empty": "Text answer cannot be empty",
      }),
    })
    .messages({
      "string.base": "Text answer must be a string",
      "string.min": "Text answer must be at least 5 characters long",
      "string.max": "Text answer must not exceed 5000 characters",
    }),

  // Dummy field to allow conditional validation
  file: Joi.any().optional(),
});

module.exports = submitAssignmentSchema;
