const AppError = require("../../utils/AppError");
const enrollmentModel = require("../../model/enrollmentModel");
const mongoose = require("mongoose");

const getCourseProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError("Invalid course ID", 400));
    }

    // Check enrollment
    const enrollment = await enrollmentModel.findOne({
      courseId,
      userId,
    });

    if (!enrollment) {
      return next(new AppError("You have not enrolled in this course", 403));
    }

    res.status(200).json({
      status: "success",
      message: "Course progress fetched",
      data: {
        courseId,
        progressPercent: enrollment.progressPercent ?? 0,
        isCompleted: enrollment.isCompleted || false,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getCourseProgress;
