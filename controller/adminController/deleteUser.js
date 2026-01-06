const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");
const mongoose = require("mongoose");

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    //check if user id is a mongoose Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid user ID", 400));
    }

    //check if account still exists
    const user = await userModel.findById(id);

    if (!user) return next(new AppError("User not found", 404));

    // prevent deleting self
    if (req.user.id === user._id) {
      return next(new AppError("You cannot delete yourself", 400));
    }

    // only students can be deleted
    if (user.role !== "student") {
      return next(new AppError("Only students can be deleted", 403));
    }

    // delete student account
    await user.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Student deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const deleteInstructor = async (req, res, next) => {
  try {
    const { id } = req.params;

    //check if user id is a mongoose Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid user ID", 400));
    }

    //check if account still exists
    const user = await userModel.findById(id);

    if (!user) return next(new AppError("User not found", 404));

    // prevent deleting self
    if (req.user.id === user._id) {
      return next(new AppError("You cannot delete yourself", 400));
    }

    // only students can be deleted
    if (user.role !== "instructor") {
      return next(new AppError("Only instructors can be deleted", 403));
    }

    // delete instructor account
    await user.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Instructor deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { deleteStudent, deleteInstructor };
