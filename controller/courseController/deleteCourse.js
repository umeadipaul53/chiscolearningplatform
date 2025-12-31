const AppError = require("../../utils/AppError");
const courseModel = require("../../model/courseModel");
const userModel = require("../../model/userModel");
const mongoose = require("mongoose");

const deleteCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError("Invalid Course ID", 400));
    }

    const user = await userModel.findById(userId);

    if (!user) return next(new AppError("User not found", 404));

    const courseCheck = await courseModel.findById(courseId);

    if (!courseCheck) return next(new AppError("Course not found", 404));

    /**
     * Authorization
     * - Admin: can delete any course
     * - Instructor: can only delete their own course
     */
    if (user.role === "instructor") {
      if (!courseCheck.createdBy.equals(userId)) {
        return next(
          new AppError("You are not allowed to delete this course", 403)
        );
      }
    }

    await courseModel.findByIdAndDelete(courseId);

    res.status(200).json({
      message: "Deleted course successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteCourse;
