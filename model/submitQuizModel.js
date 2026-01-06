const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: String,
        isCorrect: Boolean,
        score: Number,
      },
    ],

    totalScore: {
      type: Number,
      min: 0,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    isSubmitted: { type: Boolean, default: false },

    submittedAt: Date,

    startedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

/* ---- */

// Prevent multiple submissions per quiz per student
quizSubmissionSchema.index({ quizId: 1, userId: 1 }, { unique: true });

// Fast lookups
quizSubmissionSchema.index({ userId: 1 });
quizSubmissionSchema.index({ quizId: 1 });

const submitQuizModel = mongoose.model("QuizSubmission", quizSubmissionSchema);

module.exports = submitQuizModel;
