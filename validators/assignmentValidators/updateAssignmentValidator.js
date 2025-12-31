const Joi = require("joi");

const updateAssignment = Joi.object({
  title: Joi.string().trim().min(3).max(150),
  instructions: Joi.string().trim().min(5),
  descriptions: Joi.string().trim().min(5),
  deadline: Joi.date().allow(null).greater("now"),
}).min(1);

module.exports = updateAssignment;
