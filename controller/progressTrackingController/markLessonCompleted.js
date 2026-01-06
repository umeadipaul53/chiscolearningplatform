const AppError = require("../../utils/AppError");
const lessonModel = require("../../model/lessonModel");
const progressModel = require("../../model/progressModel");
const enrollmentModel = require("../../model/enrollmentModel");
const mongoose = require("mongoose");

const markLessonCompleted = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.body;

    // Validate lesson ID
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return next(new AppError("Invalid lesson ID", 400));
    }

    // Find lesson
    const lesson = await lessonModel.findById(lessonId);

    if (!lesson) {
      return next(new AppError("Lesson not found", 404));
    }

    // Confirm enrollment FIRST
    const enrollment = await enrollmentModel.findOne({
      courseId: lesson.course,
      userId,
    });

    if (!enrollment) {
      return next(new AppError("You have not enrolled for this course", 403));
    }

    // Total lessons in course
    const totalCourseLessons = await lessonModel.countDocuments({
      course: lesson.course,
    });

    if (totalCourseLessons === 0) {
      return next(new AppError("Course has no lessons", 400));
    }

    // Fetch or create progress
    let userProgress = await progressModel.findOne({
      courseId: lesson.course,
      userId,
    });

    if (!userProgress) {
      userProgress = await progressModel.create({
        userId,
        courseId: lesson.course,
        completedLessons: [],
      });
    }

    if (userProgress.completedLessons.includes(lessonId)) {
      return next(new AppError("Lesson already completed", 400));
    }

    // Prevent duplicate lesson completion
    if (!userProgress.completedLessons.includes(lessonId)) {
      userProgress.completedLessons.push(lessonId);
      await userProgress.save();
    }

    // Calculate progress
    const totalLessonsByUser = userProgress.completedLessons.length;

    const courseProgressPercentage =
      (totalLessonsByUser / totalCourseLessons) * 100;

    // Update enrollment progress
    enrollment.progressPercent = Math.round(courseProgressPercentage);

    // if enrollment is 100%
    if (courseProgressPercentage === 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      status: "success",
      message: "Lesson marked as completed",
      progress: enrollment.progressPercent,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = markLessonCompleted;
