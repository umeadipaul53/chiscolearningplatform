const Joi = require("joi");

const validateLessonUpdate = Joi.object({
  lessonTitle: Joi.string().trim().min(3).max(150).required().messages({
    "string.base": "Lesson title must be a string",
    "string.empty": "Lesson title is required",
    "string.min": "Lesson title must be at least 3 characters",
    "string.max": "Lesson title must not exceed 150 characters",
    "any.required": "Lesson title is required",
  }),

  lessonContent: Joi.string().trim().min(10).required().messages({
    "string.base": "Lesson content must be a string",
    "string.empty": "Lesson content is required",
    "string.min": "Lesson content must be at least 10 characters",
    "any.required": "Lesson content is required",
  }),
});

module.exports = validateLessonUpdate;
