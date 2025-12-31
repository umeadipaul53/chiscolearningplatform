const AppError = require("../../utils/AppError");
const courseModel = require("../../model/courseModel");
const mongoose = require("mongoose");
const assignmentModel = require("../../model/assignmentModel");

const createAssignment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const { title, instructions, descriptions, deadline } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError("Invalid course ID", 400));
    }

    const course = await courseModel.findById(courseId);
    if (!course) return next(new AppError("Course not found", 404));

    if (course.createdBy.toString() !== userId) {
      return next(
        new AppError(
          "Only course instructors can create assignments on a course",
          403
        )
      );
    }

    const assignment = await assignmentModel.create({
      courseId,
      title,
      instructions,
      descriptions,
      deadline,
    });

    res.status(201).json({
      status: "success",
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createAssignment;
