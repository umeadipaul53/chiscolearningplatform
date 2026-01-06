const Joi = require("joi");

const saveAnswerValidator = Joi.object({
  sessionId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "any.required": "sessionId is required",
      "string.pattern.base": "sessionId must be a valid MongoDB ObjectId",
    }),
  questionId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "any.required": "questionId is required",
      "string.pattern.base": "questionId must be a valid MongoDB ObjectId",
    }),
  quizId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "any.required": "quizId is required",
      "string.pattern.base": "quizId must be a valid MongoDB ObjectId",
    }),
  selectedOption: Joi.string().min(1).max(500).required().messages({
    "string.base": "selectedOption must be a string",
    "string.empty": "selectedOption cannot be empty",
    "string.max": "selectedOption is too long",
    "any.required": "selectedOption is required",
  }),
});

module.exports = saveAnswerValidator;
