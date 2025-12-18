const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        selectedOption: {
          type: Number,
          required: true,
        },
      },
    ],

    score: {
      type: Number,
      required: true,
      min: 0,
    },

    passed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ---- */

// Prevent multiple submissions per quiz per student
quizSubmissionSchema.index({ quiz: 1, student: 1 }, { unique: true });

// Fast lookups
quizSubmissionSchema.index({ student: 1 });
quizSubmissionSchema.index({ quiz: 1 });

const submitQuizModel = mongoose.model("QuizSubmission", quizSubmissionSchema);

module.exports = submitQuizModel;
