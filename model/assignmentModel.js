const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    instructions: {
      type: String,
      required: true,
      trim: true,
    },
    descriptions: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Fetch assignments for a course
assignmentSchema.index({ courseId: 1 });

// Order assignments inside a course
assignmentSchema.index({ courseId: 1, createdAt: 1 });

const assignmentModel = mongoose.model("Assignment", assignmentSchema);

module.exports = assignmentModel;
