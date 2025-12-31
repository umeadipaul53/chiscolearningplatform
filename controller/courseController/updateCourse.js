const AppError = require("../../utils/AppError");
const courseModel = require("../../model/courseModel");
const userModel = require("../../model/userModel");
const mongoose = require("mongoose");

const updateCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;
    const { values } = req.body;

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError("Invalid Course ID", 400));
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Find course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    /**
     * Authorization
     * - Admin: can update any course
     * - Instructor: can only update their own course
     */
    if (user.role === "instructor") {
      if (!course.createdBy.equals(userId)) {
        return next(
          new AppError("You are not allowed to update this course", 403)
        );
      }
    }

    // Prevent duplicate title (only if title is being updated)
    if (values?.title) {
      const titleExists = await courseModel.findOne({
        title: { $regex: `^${values.title}$`, $options: "i" },
        _id: { $ne: courseId },
      });

      if (titleExists) {
        return next(new AppError("Course title already exists", 409));
      }
    }

    // Update course
    const updatedCourse = await courseModel.findByIdAndUpdate(
      courseId,
      values,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateCourse;
