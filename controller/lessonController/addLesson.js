const AppError = require("../../utils/AppError");
const courseModel = require("../../model/courseModel");
const lessonModel = require("../../model/lessonModel");
const cloudinary = require("../../config/cloudinary");

//upload to cloudinary using buffer
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

const addLesson = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { lessonTitle, courseId, lessonContent } = req.body;

    // verify course ownership
    const course = await courseModel.findOne({
      _id: courseId,
      createdBy: userId,
    });

    if (!course) {
      return next(new AppError("Course not found or access denied", 404));
    }

    let files = [];

    // Files are OPTIONAL
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploadResult = await streamUpload(
          file.buffer,
          file.mimetype === "application/pdf" ? "raw" : "image"
        );

        files.push({
          fileUrl: uploadResult.secure_url,
          fileId: uploadResult.public_id,
          fileCategory: file.mimetype.startsWith("image") ? "image" : "pdf",
          mimeType: file.mimetype,
          fileSize: file.size,
        });
      }
    }

    const lesson = await lessonModel.create({
      course: courseId,
      lessonTitle,
      lessonContent,
      files, // empty array allowed if no files was selected
    });

    res.status(201).json({
      status: "success",
      message: "Lesson added successfully",
      data: lesson,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = addLesson;
