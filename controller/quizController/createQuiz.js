const quizModel = require("../../model/quizModel");
const courseModel = require("../../model/courseModel");
const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");

const createQuiz = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId, title, questions, allowResult, publish } = req.body;

    if (!title || title.trim() === "") {
      return next(new AppError("Quiz title is required", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      // check if courseid is a mongoose id
      return next(new AppError("Invalid course ID", 400));
    }

    //check if questions is an array of questions

    if (!Array.isArray(questions) || questions.length === 0) {
      return next(
        new AppError(
          "Questions must be an array of questions and must not be empty",
          400
        )
      );
    }

    //check course ownership
    const course = await courseModel.findOne({
      _id: courseId,
      createdBy: userId,
    });

    if (!course)
      return next(
        new AppError("Only course owners can create quiz for a course", 409)
      );

    // check if the same title and courseId exists
    const quiz = await quizModel.findOne({
      courseId,
      title,
    });

    if (quiz) {
      // add to the array of existing questions and save
      quiz.questions.push(...questions);
      quiz.allowResult = allowResult;
      quiz.publish = publish;
      await quiz.save();
    } else {
      //create a quiz
      quiz = await quizModel.create({
        courseId,
        title,
        questions,
        allowResult,
        publish,
        createdBy: userId,
      });
    }

    res.status().json({
      status: "success",
      message: "Created quiz successfully",
      data: quiz,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createQuiz;
