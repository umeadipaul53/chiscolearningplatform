const enrollmentModel = require("../../model/enrollmentModel");
const AppError = require("../../utils/AppError");
const courseModel = require("../../model/courseModel");
const mongoose = require("mongoose");

const userEnrollmentAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError("Invalid course ID", 400));
    }

    const courseExists = await courseModel.exists({ _id: courseId });
    if (!courseExists) {
      return next(new AppError("Course not found", 404));
    }

    const is_enrolled = await enrollmentModel.exists({
      userId,
      courseId,
    });

    res.status(200).json({
      status: "success",
      is_enrolled: Boolean(is_enrolled),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = userEnrollmentAccess;
