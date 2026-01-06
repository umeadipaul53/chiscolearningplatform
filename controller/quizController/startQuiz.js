const quizModel = require("../../model/quizModel");
const submitQuizModel = require("../../model/submitQuizModel");
const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");

const startQuiz = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { quizId } = req.params;

    // validate quiz id
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return next(new AppError("Invalid quiz ID", 400));
    }

    // verify quiz
    const quiz = await quizModel.findById(quizId);

    if (!quiz) {
      return next(new AppError("Quiz not found", 404));
    }

    if (!quiz.publish) {
      return next(new AppError("This quiz is not available yet", 403));
    }

    // create quiz session
    let quizSession;

    try {
      quizSession = await submitQuizModel.create({
        userId,
        quizId,
        startedAt: new Date(),
      });
    } catch (err) {
      // Duplicate attempt (unique index)
      if (err.code === 11000) {
        return next(new AppError("You have already started this quiz", 403));
      }
      throw err;
    }

    res.status(201).json({
      status: "success",
      message: "Quiz started successfully",
      sessionId: quizSession._id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = startQuiz;
