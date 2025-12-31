const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    fileId: {
      type: String,
      required: true, // Cloudinary public_id
    },

    fileCategory: {
      type: String,
      enum: ["image", "pdf"], // for frontend clarity
      required: true,
    },

    mimeType: {
      type: String,
      enum: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v <= 2 * 1024 * 1024; // 2MB max
        },
        message: "File size must not exceed 2MB",
      },
    },
  },
  { _id: false }
);

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

    files: {
      type: [fileSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Fetch lessons for a course
lessonSchema.index({ course: 1 });

// Order lessons inside a course
lessonSchema.index({ course: 1, createdAt: 1 });

const lessonModel = mongoose.model("Lesson", lessonSchema);

module.exports = lessonModel;
