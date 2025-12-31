const AppError = require("../../utils/AppError");
const courseModel = require("../../model/courseModel");
const enrollmentModel = require("../../model/enrollmentModel");
const userModel = require("../../model/userModel");
const mongoose = require("mongoose");

const courseEnrollment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    // check if course id is a valid mongo id
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError("Invalid course ID", 400));
    }

    // fetch user
    const user = await userModel.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // check if course id is in DB
    const course = await courseModel.findById(courseId);

    if (!course) return next(new AppError("course not found", 404));

    // check if user has enrolled already
    const existingEnrollment = await enrollmentModel.findOne({
      courseId,
      userId,
    });

    if (existingEnrollment)
      return next(
        new AppError("You have been enrolled in this course already", 409)
      );

    //enroll user
    await enrollmentModel.create({
      courseId,
      userId,
    });

    // update user
    user.coursesEnrolled.push(courseId);
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Enrollment successful",
      data: user.coursesEnrolled,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = courseEnrollment;
