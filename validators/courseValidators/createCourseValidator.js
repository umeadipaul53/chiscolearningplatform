const Joi = require("joi");

const createCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.base": "Course title must be a string",
    "string.empty": "Course title is required",
    "string.min": "Course title must be at least 3 characters long",
    "string.max": "Course title must not exceed 100 characters",
  }),

  description: Joi.string().trim().min(10).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters long",
  }),

  category: Joi.string().trim().min(3).max(50).required().messages({
    "string.base": "Category must be a string",
    "string.empty": "Category is required",
    "string.min": "Category must be at least 3 characters long",
    "string.max": "Category must not exceed 50 characters",
  }),

  level: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .default("beginner")
    .messages({
      "any.only": "Level must be one of beginner, intermediate, or advanced",
    }),

  what_to_learn: Joi.string().trim().min(10).required().messages({
    "string.base": "What to learn must be a string",
    "string.empty": "What to learn field is required",
    "string.min": "What to learn must be at least 10 characters long",
  }),

  thumbnail: Joi.string().uri().required().messages({
    "string.base": "Thumbnail must be a string",
    "string.empty": "Thumbnail is required",
    "string.uri": "Thumbnail must be a valid URL",
  }),
}).options({ abortEarly: false });

module.exports = createCourseSchema;
