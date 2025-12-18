const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    lessonTitle: {
      type: String,
      required: true,
      trim: true,
    },

    lessonContent: {
      type: String,
      required: true,
      trim: true,
    },

    file: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* ---- INDEXES ---- */

// Fetch lessons for a course
lessonSchema.index({ course: 1 });

// Order lessons inside a course
lessonSchema.index({ course: 1, createdAt: 1 });

const lessonModel = mongoose.model("Lesson", lessonSchema);

module.exports = lessonModel;
