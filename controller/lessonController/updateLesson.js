const AppError = require("../../utils/AppError");
const courseModel = require("../../model/courseModel");
const lessonModel = require("../../model/lessonModel");
const cloudinary = require("../../config/cloudinary");
const mongoose = require("mongoose");

// upload to cloudinary using buffer
const streamUpload = (buffer, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "lesson_files",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const updateLesson = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.params;
    const { lessonTitle, lessonContent } = req.body;

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

    // Update text fields ONLY if provided
    if (lessonTitle) lesson.lessonTitle = lessonTitle;
    if (lessonContent) lesson.lessonContent = lessonContent;

    // deleted old files if only new files were uploaded
    if (req.files && req.files.length) {
      // Delete old files
      if (lesson.files && lesson.files.length) {
        for (const file of lesson.files) {
          await cloudinary.uploader.destroy(file.fileId, {
            resource_type: file.fileCategory === "pdf" ? "raw" : "image",
          });
        }
      }

      // Upload new files
      const uploadedFiles = [];

      for (const file of req.files) {
        const uploadResult = await streamUpload(
          file.buffer,
          file.mimetype === "application/pdf" ? "raw" : "image"
        );

        uploadedFiles.push({
          fileUrl: uploadResult.secure_url,
          fileId: uploadResult.public_id,
          fileCategory: file.mimetype.startsWith("image") ? "image" : "pdf",
          mimeType: file.mimetype,
          fileSize: file.size,
        });
      }

      lesson.files = uploadedFiles;
    }

    // Save lesson
    const updatedLesson = await lesson.save();

    res.status(200).json({
      status: "success",
      message: "Lesson updated successfully",
      data: updatedLesson,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateLesson;
