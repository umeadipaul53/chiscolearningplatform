const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const submitAssignmentSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Text-based submission
    textAnswer: {
      type: String,
      trim: true,
    },

    // File-based submission
    file: {
      url: String,
      publicId: String, // for Cloudinary
      mimeType: String,
      size: Number,
      originalName: String,
    },
  },
  {
    timestamps: true,
  }
);

/* ---- VALIDATION ---- */
// Require at least text OR file
submitAssignmentSchema.pre("validate", function (next) {
  if (!this.textAnswer && !this.file?.url) {
    return next(
      new AppError(
        "Submission must include either a text answer or a file",
        400
      )
    );
  }
  next();
});

// One submission per user per assignment
submitAssignmentSchema.index({ assignmentId: 1, userId: 1 }, { unique: true });

// For sorting submissions
submitAssignmentSchema.index({ assignmentId: 1, createdAt: -1 });

const submitAssignmentModel = mongoose.model(
  "SubmitAssignment",
  submitAssignmentSchema
);

module.exports = submitAssignmentModel;
