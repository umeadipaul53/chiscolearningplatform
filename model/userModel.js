const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },

    coursesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

    verifyAccount: {
      type: Boolean,
      default: false,
    },
    twofactorStatus: {
      type: Boolean,
      default: true,
    },
    instructorStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ---- INDEXES ----*/

// Fast login & lookup
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

// Sorting by newest users
userSchema.index({ createdAt: -1 });

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
