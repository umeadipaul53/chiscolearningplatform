const AppError = require("../../utils/AppError");
const mongoose = require("mongoose");
const assignmentModel = require("../../model/assignmentModel");
const paginate = require("../../utils/paginate");

const getAllCourseAssignments = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { page, limit } = req.query;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError("Invalid course ID", 400));
    }

    const filter = { courseId };

    const { results: assignments, pagination } = await paginate({
      model: assignmentModel,
      filter,
      page,
      limit,
      sort: "-createdAt",
    });

    res.status(200).json({
      status: "success",
      message:
        assignments.length > 0
          ? "All assignments for this course retrieved successfully"
          : "No assignment found for this course",
      count: pagination.totalResults,
      pagination,
      data: assignments,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllCourseAssignments;
