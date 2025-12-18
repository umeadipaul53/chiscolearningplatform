const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    assignmentTitle: {
      type: String,
      required: true,
      trim: true,
    },

    instructions: {
      type: String,
      required: true,
      trim: true,
    },

    submissionDeadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Fetch assignments for a course
assignmentSchema.index({ course: 1 });

// Order assignments inside a course
assignmentSchema.index({ course: 1, createdAt: 1 });

const assignmentModel = mongoose.model("Assignment", assignmentSchema);

module.exports = assignmentModel;
