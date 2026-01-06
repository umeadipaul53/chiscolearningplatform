const Joi = require("joi");

// question validator
const questionSchema = Joi.object({
  question: Joi.string().trim().min(3).required().messages({
    "string.empty": "Question text is required",
    "string.min": "Question must be at least 3 characters long",
  }),

  options: Joi.array()
    .items(Joi.string().trim().min(1).required())
    .min(2)
    .required()
    .messages({
      "array.base": "Options must be an array",
      "array.min": "Each question must have at least two options",
    }),

  correctAnswer: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      const { options } = helpers.state.ancestors[0];

      if (!options || !options.includes(value)) {
        return helpers.message(
          "Correct answer must be one of the provided options"
        );
      }

      return value;
    }),
});

const createQuizSchema = Joi.object({
  courseId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid course ID",
      "string.empty": "Course ID is required",
    }),

  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Quiz title is required",
    "string.min": "Quiz title must be at least 3 characters long",
  }),

  questions: Joi.array().items(questionSchema).min(1).required().messages({
    "array.base": "Questions must be an array",
    "array.min": "Quiz must contain at least one question",
  }),

  allowResult: Joi.boolean().optional(),
});

module.exports = createQuizSchema;
