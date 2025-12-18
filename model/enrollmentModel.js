const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

/* ---- INDEXES ---- */

// Prevent duplicate enrollment
enrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

// Fast lookups
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });

const enrollmentModel = mongoose.model("Enrollment", enrollmentSchema);

module.exports = enrollmentModel;
