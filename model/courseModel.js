const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    what_to_learn: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Course listing & filtering
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });

// Instructor dashboards
courseSchema.index({ createdBy: 1 });

// Latest courses
courseSchema.index({ createdAt: -1 });

// Search optimization (basic text search)
courseSchema.index({
  title: "text",
  description: "text",
  what_to_learn: "text",
});

const courseModel = mongoose.model("Course", courseSchema);

module.exports = courseModel;
