const Joi = require("joi");

const validateAssignment = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "Assignment title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title must not exceed 150 characters",
  }),

  instructions: Joi.string().trim().min(5).required().messages({
    "string.empty": "Instructions are required",
    "string.min": "Instructions must be at least 5 characters",
  }),

  descriptions: Joi.string().trim().min(5).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 5 characters",
  }),

  deadline: Joi.date().allow(null).greater("now").messages({
    "date.base": "Deadline must be a valid date",
    "date.greater": "Deadline must be in the future",
  }),
});

module.exports = validateAssignment;
