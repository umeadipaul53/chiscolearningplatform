const quizModel = require("../../model/quizModel");
const submitQuizModel = require("../../model/submitQuizModel");
const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");

const saveAnswerPerQuestion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionId, questionId, selectedOption, quizId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return next(new AppError("Invalid quiz ID", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return next(new AppError("Invalid session ID", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return next(new AppError("Invalid question ID", 400));
    }

    //fetch quiz
    const quiz = await quizModel.findById(quizId);

    if (!quiz) {
      return next(new AppError("Quiz not found", 404));
    }

    // check if question id is in the list of question ids
    const question = quiz.questions.find(
      (q) => q._id.toString() === questionId
    );

    if (!question) {
      return next(new AppError("Question not found", 404));
    }

    // check if selectedOptions is in the list of options for the question
    if (!question.options.includes(selectedOption)) {
      return next(new AppError("Selected option is not valid", 400));
    }

    // fetch the quiz session created
    const session = await submitQuizModel.findById(sessionId);

    if (!session) {
      return next(new AppError("Quiz session not found", 404));
    }

    // prevent unauthorized access to user session
    if (session.userId.toString() !== userId) {
      return next(new AppError("Not authorized", 403));
    }

    if (session.quizId.toString() !== quizId) {
      return next(new AppError("Session does not match quiz", 400));
    }

    if (session.isSubmitted) {
      return next(new AppError("Quiz already submitted", 403));
    }

    // save updated answer
    const isCorrect = question.correctAnswer === selectedOption;

    const existingIndex = session.answers.findIndex(
      (ans) => ans.questionId.toString() === questionId
    );

    if (existingIndex !== -1) {
      session.answers[existingIndex].selectedOption = selectedOption;
      session.answers[existingIndex].isCorrect = isCorrect;
    } else {
      session.answers.push({
        questionId,
        selectedOption,
        isCorrect,
      });
    }

    await session.save();

    res.status(200).json({
      status: "success",
      message: "Answer saved successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = saveAnswerPerQuestion;
