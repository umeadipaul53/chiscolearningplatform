const AppError = require("../../utils/AppError");
const courseModel = require("../../model/courseModel");
const lessonModel = require("../../model/lessonModel");
const paginate = require("../../utils/paginate");
const mongoose = require("mongoose");

const getAllCourseLessons = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError("Invalid Course ID", 400));
    }

    // verify courseId
    const checkCourse = await courseModel.findOne({
      _id: courseId,
    });

    if (!checkCourse) {
      return next(new AppError("Course not found", 404));
    }

    const filter = { course: courseId };

    const { results: lessons, pagination } = await paginate({
      model: lessonModel,
      filter,
      page,
      limit,
      sort: "-createdAt",
    });

    res.status(200).json({
      status: "success",
      message:
        lessons.length > 0
          ? "All Lessons retrieved successfully"
          : "No Lessons found",
      count: pagination.totalResults,
      pagination,
      data: lessons,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllCourseLessons;
