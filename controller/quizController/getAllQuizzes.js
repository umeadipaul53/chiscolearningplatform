const quizModel = require("../../model/quizModel");
const courseModel = require("../../model/courseModel");
const mongoose = require("mongoose");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");

const getAllQuizzes = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // VALIDATE COURSE ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError("Invalid Course ID", 400));
    }

    // VERIFY COURSE EXISTS
    const course = await courseModel.findById(courseId);

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    let filter = { courseId };
    let select = "";

    if (req.user.role === "instructor") {
      if (course.createdBy.toString() !== req.user.id) {
        return next(
          new AppError(
            "Only course owners can view all quizzes for this course",
            403
          )
        );
      }
    } else if (req.user.role === "student") {
      filter = { courseId, publish: true };
      select = "-questions.correctAnswer -allowResult -publish";
    }

    // FETCH QUIZZES
    const { results, pagination } = await paginate({
      model: quizModel,
      filter,
      page,
      limit,
      sort: "-createdAt",
      select,
    });

    res.status(200).json({
      status: "success",
      message:
        results.length > 0
          ? "Quizzes retrieved successfully"
          : "No quiz found for this course",
      count: pagination.totalResults,
      pagination,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllQuizzes;
