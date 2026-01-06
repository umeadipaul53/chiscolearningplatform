const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");
const mongoose = require("mongoose");

const approveInstructorAccount = async (req, res, next) => {
  try {
    const { id } = req.params;

    //check if user id is a mongoose Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid user ID", 400));
    }

    //check if account exists, if user is instructor and update if account is not activated already
    const user = await userModel.findOneAndUpdate(
      {
        _id: id,
        role: "instructor",
        instructorStatus: false,
      },
      { instructorStatus: true },
      { new: true }
    );

    if (!user) {
      return next(
        new AppError(
          "User not found, not an instructor, or already activated",
          404
        )
      );
    }

    res.status(200).json({
      status: "success",
      message: "Instructor account activated successfully",
      data: {
        id: user._id,
        email: user.email,
        instructorStatus: user.instructorStatus,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = approveInstructorAccount;
