const submitQuizModel = require("../../model/submitQuizModel");
const quizModel = require("../../model/quizModel");
const courseModel = require("../../model/courseModel");
const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");

const getQuizResult = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { quizId } = req.params;

    // validate quiz id
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return next(new AppError("Invalid quiz ID", 400));
    }

    // check quiz existence
    const quiz = await quizModel.findById(quizId);

    if (!quiz) {
      return next(new AppError("Quiz not found", 404));
    }

    // check if result viewing is allowed
    if (!quiz.allowResult) {
      return next(
        new AppError("You can't view quiz result at the moment", 403)
      );
    }

    // find user's submitted quiz
    const submitQuiz = await submitQuizModel.findOne({
      quizId,
      userId,
    });

    if (!submitQuiz) {
      return next(new AppError("You have not taken this quiz", 404));
    }

    if (!submitQuiz.isSubmitted) {
      return next(new AppError("Only submitted quizzes can be viewed", 403));
    }

    res.status(200).json({
      status: "success",
      data: {
        totalScore: submitQuiz.totalScore,
        passed: submitQuiz.passed,
        percentage:
          (submitQuiz.totalScore * 100) / (submitQuiz.answers.length * 2),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAllQuizResult = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // validate quiz id
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return next(new AppError("Invalid quiz ID", 400));
    }

    // check quiz existence
    const quiz = await quizModel.findById(quizId);

    if (!quiz) {
      return next(new AppError("Quiz not found", 404));
    }

    // check authorization
    if (req.user.role === "instructor") {
      const course = await courseModel.findById(quiz.courseId);

      if (!course) {
        return next(new AppError("Course not found", 404));
      }

      if (course.createdBy.toString() !== req.user.id) {
        return next(
          new AppError("Only the course owner can view quiz results", 403)
        );
      }
    }

    // fetch quiz results
    const { results, pagination } = await paginate({
      model: submitQuizModel,
      filter: { quizId, isSubmitted: true },
      page,
      limit,
      sort: "-submittedAt",
      select: "-answers.correctAnswer",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    res.status(200).json({
      status: "success",
      count: pagination.totalResults,
      pagination,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getQuizResult, getAllQuizResult };
