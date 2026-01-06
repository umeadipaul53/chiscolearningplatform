const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
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

    questions: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },
        options: {
          type: [String], // input all options
          validate: {
            validator: function (v) {
              return Array.isArray(v) && v.length >= 2;
            },
            message: "Questions must have at least two options.",
          },
        },
        correctAnswer: {
          type: String,
          required: true,
          validate: {
            validator: function (val) {
              return this.options.includes(val);
            },
            message: "Correct answer must be one of the options.",
          },
        },
      },
    ],

    allowResult: { type: Boolean, default: false },
    publish: { type: Boolean, default: false }, // if true, student can now see the quiz
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/* ---- INDEXES ---- */
quizSchema.index({ courseId: 1 });
quizSchema.index({ createdAt: -1 });

const quizModel = mongoose.model("Quiz", quizSchema);

module.exports = quizModel;
