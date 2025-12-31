const AppError = require("../../utils/AppError");
const mongoose = require("mongoose");
const courseModel = require("../../model/courseModel");
const lessonModel = require("../../model/lessonModel");
const cloudinary = require("../../config/cloudinary");

const deleteLesson = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.params;

    // Validate lesson ID
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return next(new AppError("Invalid lesson ID", 400));
    }

    // Find lesson
    const lesson = await lessonModel.findById(lessonId);

    if (!lesson) {
      return next(new AppError("Lesson not found", 404));
    }

    // Check course ownership
    const course = await courseModel.findOne({
      _id: lesson.course,
      createdBy: userId,
    });

    if (!course) {
      return next(
        new AppError("Access denied. You did not create this course.", 403)
      );
    }

    // Delete lesson files from Cloudinary
    if (lesson.files && lesson.files.length) {
      for (const file of lesson.files) {
        await cloudinary.uploader.destroy(file.fileId, {
          resource_type: file.fileCategory === "pdf" ? "raw" : "image",
        });
      }
    }

    // Delete lesson document
    await lesson.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Lesson deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteLesson;
