const submitQuizModel = require("../../model/submitQuizModel");
const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const progressModel = require("../../model/progressModel");
const quizModel = require("../../model/quizModel");

const submitQuiz = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    // Validate session ID
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return next(new AppError("Invalid session ID", 400));
    }

    // Fetch session
    const session = await submitQuizModel.findById(sessionId);

    if (!session) {
      return next(new AppError("Session not found", 404));
    }

    // Prevent multiple submissions
    if (session.isSubmitted) {
      return next(new AppError("Quiz already submitted", 400));
    }

    // Calculate total score safely
    const totalScore = session.answers.reduce(
      (total, answer) => total + (answer.score || 0),
      0
    );

    // each question = 2 marks
    const maxScore = session.answers.length * 2;
    const average = (totalScore / maxScore) * 100;

    // Update session
    session.totalScore = totalScore;
    session.isSubmitted = true;
    session.submittedAt = new Date();
    session.passed = average >= 50;

    await session.save();

    // Fetch quiz
    const quiz = await quizModel.findById(session.quizId);

    if (!quiz) {
      return next(new AppError("Quiz not found", 404));
    }

    // Update progress
    let progress = await progressModel.findOne({
      userId: session.userId,
      courseId: quiz.courseId,
    });

    if (!progress) {
      progress = await progressModel.create({
        userId: session.userId,
        courseId: quiz.courseId,
        completedQuizzes: [],
      });
    }

    // Prevent duplicates
    if (!progress.completedQuizzes.includes(quiz._id)) {
      progress.completedQuizzes.push(quiz._id);
    }

    await progress.save();

    // Response
    res.status(200).json({
      status: "success",
      message: "Quiz submitted successfully",
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = submitQuiz;
