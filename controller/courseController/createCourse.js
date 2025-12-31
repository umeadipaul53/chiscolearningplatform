const AppError = require("../../utils/AppError");
const courseModel = require("../../model/courseModel");
const userModel = require("../../model/userModel");

const createCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { title, description, category, level, what_to_learn, thumbnail } =
      req.body;

    // Verify user
    const user = await userModel.findById(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Role authorization
    if (!["admin", "instructor"].includes(user.role)) {
      return next(new AppError("You are not allowed to create a course", 403));
    }

    if (!user.instructorStatus)
      return next(
        new AppError(
          "Your account has not been activated to create a course, kindly contact admin to activate your account"
        )
      );

    // Prevent duplicate titles (case-insensitive)
    const existingCourse = await courseModel.findOne({
      title: { $regex: `^${title}$`, $options: "i" },
    });

    if (existingCourse) {
      return next(new AppError("Course title already exists", 409));
    }

    // Create course
    const courseCreated = await courseModel.create({
      title,
      description,
      category,
      level,
      what_to_learn,
      thumbnail,
      createdBy: userId,
    });

    // update user
    user.coursesCreated.push(courseCreated._id);
    await user.save();

    // Success response
    res.status(201).json({
      message: "Course created successfully",
      data: courseCreated,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createCourse;
