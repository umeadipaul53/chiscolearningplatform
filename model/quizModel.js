const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },
        options: {
          type: [String],
          required: true,
          validate: (v) => v.length >= 2,
        },
        correctAnswer: {
          type: String,
          required: true,
        },
      },
    ],

    allowResult: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ---- INDEXES ---- */
quizSchema.index({ course: 1 });
quizSchema.index({ createdAt: -1 });

const quizModel = mongoose.model("Quiz", quizSchema);

module.exports = quizModel;
