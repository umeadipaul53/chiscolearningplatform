const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await userModel
      .findById(userId)
      .select("email name phone role coursesEnrolled coursesCreated");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Determine courses based on role
    const courses =
      user.role === "student" ? user.coursesEnrolled : user.coursesCreated;

    res.status(200).json({
      id: user._id,
      email: user.email,
      fullname: user.name,
      phone: user.phone,
      role: user.role,
      courses,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getUserProfile;
