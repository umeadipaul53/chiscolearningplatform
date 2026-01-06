const AppError = require("../../utils/AppError");
const mongoose = require("mongoose");
const submitAssignmentModel = require("../../model/submitAssignmentModel");
const assignmentModel = require("../../model/assignmentModel");
const paginate = require("../../utils/paginate");
const courseModel = require("../../model/courseModel");

const getSubmittedAssignments = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // check if the assignment ID is a valid mongoose DB id
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return next(new AppError("Invalid assignment ID", 400));
    }

    // check if the assignment exists
    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return next(new AppError("Assignment not found", 404));
    }

    //check if the course for the assignment exists
    const course = await courseModel.findById(assignment.courseId);

    // AUTHORIZATION: only instructor can view submitted assignments
    if (course.createdBy.toString() !== req.user.id) {
      return next(new AppError("You are not allowed to view submissions", 403));
    }

    const { results, pagination } = await paginate({
      model: submitAssignmentModel,
      filter: { assignmentId },
      page,
      limit,
      sort: "-createdAt",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    res.status(200).json({
      status: "success",
      message:
        results.length > 0
          ? "Submitted assignments retrieved successfully"
          : "No submissions found for this assignment",
      count: pagination.totalResults,
      pagination,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getSubmittedAssignments;
