const Joi = require("joi");

const updateCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().min(10),
  category: Joi.string().trim().min(3).max(50),
  level: Joi.string().valid("beginner", "intermediate", "advanced"),
  what_to_learn: Joi.string().trim().min(10),
  thumbnail: Joi.string().uri(),
})
  .min(1) // require at least one field
  .options({ abortEarly: false });

module.exports = updateCourseSchema;
