const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    userId: {
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
enrollmentSchema.index({ courseId: 1, userId: 1 }, { unique: true });

// Fast lookups
enrollmentSchema.index({ userId: 1 });
enrollmentSchema.index({ courseId: 1 });

const enrollmentModel = mongoose.model("Enrollment", enrollmentSchema);

module.exports = enrollmentModel;
