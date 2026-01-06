const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
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
  },
  { timestamps: true }
);

/* ---- INDEXES ---- */

// One progress doc per student per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Dashboards
progressSchema.index({ userId: 1 });
progressSchema.index({ courseId: 1 });

const progressModel = mongoose.model("Progress", progressSchema);

module.exports = progressModel;
