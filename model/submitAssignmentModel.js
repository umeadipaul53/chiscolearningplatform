const mongoose = require("mongoose");

const submitAssignmentSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    textAnswer_or_fileupload: {
      type: String,
      required: true,
      trim: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ---- INDEXES ---- */

// Fetch assignments for a course
submitAssignmentSchema.index({ course: 1 });

// Order assignments inside a course
submitAssignmentSchema.index({ course: 1, createdAt: 1 });

const submitAssignmentModel = mongoose.model(
  "Assignment",
  submitAssignmentSchema
);

module.exports = submitAssignmentModel;
