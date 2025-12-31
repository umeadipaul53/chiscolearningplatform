const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");

const getUserDetails = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const user = await userModel
      .findById(user_id)
      .select("id email name phone role");

    if (!user) return next(new AppError("user not found", 404));

    res.json({
      id: user.id,
      email: user.email,
      fullname: user.name,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getUserDetails;
