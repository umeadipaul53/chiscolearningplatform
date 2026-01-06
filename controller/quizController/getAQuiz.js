const quizModel = require("../../model/quizModel");
const courseModel = require("../../model/courseModel");
const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");

const getQuizQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = 1; // one question per page

    //VALIDATE QUIZ ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid quiz ID", 400));
    }

    //FETCH QUIZ
    const quiz = await quizModel.findById(id);

    if (!quiz) {
      return next(new AppError("Quiz not found", 404));
    }

    // COURSE CHECK
    const course = await courseModel.findById(quiz.courseId);

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // Publishing Check
    if (!quiz.publish) {
      return next(new AppError("Quiz not available yet", 403));
    }

    //Paginate questions
    const totalQuestions = quiz.questions.length;
    const totalPages = Math.ceil(totalQuestions / limit);
    const startIndex = (page - 1) * limit;

    if (page > totalPages || page < 1) {
      return next(new AppError("Invalid page number", 400));
    }

    let question = quiz.questions[startIndex];

    // only show question and options hide correctAnswer
    question = {
      _id: question._id,
      question: question.question,
      options: question.options,
    };

    res.status(200).json({
      status: "success",
      quizId: quiz._id,
      title: quiz.title,
      currentPage: page,
      totalPages,
      totalQuestions,
      data: question,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getQuizQuestions;
