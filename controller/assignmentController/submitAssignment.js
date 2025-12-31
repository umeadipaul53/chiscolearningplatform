const AppError = require("../../utils/AppError");
const mongoose = require("mongoose");
const assignmentModel = require("../../model/assignmentModel");
const submitAssignmentModel = require("../../model/submitAssignmentModel");
const cloudinary = require("../../config/cloudinary");
const enrollmentModel = require("../../model/enrollmentModel");

// Upload to Cloudinary using buffer
const streamUpload = (buffer, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "assignment_files",
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

const submitAssignment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { assignmentId } = req.params;
    const { textAnswer } = req.body;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return next(new AppError("Invalid assignment ID", 400));
    }

    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return next(new AppError("Assignment not found", 404));
    }

    //check is user is enrolled in the course
    const enrolled = await enrollmentModel.findOne({
      courseId: assignment.courseId,
      userId,
    });

    if (!enrolled)
      return next(
        new AppError(
          "Only students enrolled in a course can submit an assignment for the course ",
          403
        )
      );

    // Prevent duplicate submission
    const alreadySubmitted = await submitAssignmentModel.exists({
      userId,
      assignmentId,
    });

    if (alreadySubmitted) {
      return next(new AppError("Multiple submission not permitted", 409));
    }

    // Deadline check (only if deadline exists)
    if (assignment.deadline && new Date() > assignment.deadline) {
      return next(new AppError("Submission deadline has passed", 403));
    }

    // Must submit text or file
    if (!textAnswer && !req.file) {
      return next(new AppError("Submission must include text or a file", 400));
    }

    let uploadedFile = null;

    // File is OPTIONAL
    if (req.file) {
      const uploadResult = await streamUpload(
        req.file.buffer,
        req.file.mimetype === "application/pdf" ? "raw" : "auto"
      );

      uploadedFile = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };
    }

    const submission = await submitAssignmentModel.create({
      assignmentId,
      userId,
      textAnswer,
      file: uploadedFile,
    });

    res.status(201).json({
      status: "success",
      message: "Assignment submitted successfully",
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = submitAssignment;
