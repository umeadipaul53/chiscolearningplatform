const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");

const profileUpdate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    // Check if phone belongs to ANOTHER user
    if (phone) {
      const phoneExists = await userModel.findOne({
        phone,
        _id: { $ne: userId }, // exclude current user
      });

      if (phoneExists) {
        return next(new AppError("Phone number already exists", 409));
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, phone },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return next(new AppError("Could not update user profile", 404));
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = profileUpdate;
