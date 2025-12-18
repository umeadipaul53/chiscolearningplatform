const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    completedQuizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],

    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

/* ---- INDEXES ---- */

// One progress doc per student per course
progressSchema.index({ student: 1, course: 1 }, { unique: true });

// Dashboards
progressSchema.index({ student: 1 });
progressSchema.index({ course: 1 });

const progressModel = mongoose.model("Progress", progressSchema);

module.exports = progressModel;
