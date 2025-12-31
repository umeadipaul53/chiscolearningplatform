const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");
const { registrationTokenModel } = require("../../model/tokenModel");
const crypto = require("crypto");
const { generateAccessToken } = require("../../middleware/generateToken");
const { sendEmail } = require("../../utils/emailServices");

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const year = new Date().getFullYear();

    const user = await userModel.findOne({ email });

    if (!user)
      return next(
        new AppError(
          "Account not found, check the email you entered and try again",
          403
        )
      );

    const token = generateAccessToken(user);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await registrationTokenModel.create({
      tokenId: user._id,
      hash: hashedToken,
    });

    const resetURL = `https://chisco.softcodemicrosystem.com/change-password?token=${token}`;

    const sendingEmail = await sendEmail({
      to: user.email,
      subject: "Password Reset",
      templateName: "forgotPassword",
      variables: {
        name: user.name,
        resetURL,
        year,
      },
    });

    if (!sendingEmail) {
      console.error("❌ Failed to send reset email.");
      return next(new AppError("Failed to send reset email", 400));
    }

    console.log("✅ Verification email sent successfully to:", user.email);

    return res.status(200).json({
      message: "Password reset link has been sent to your email",
      data: {
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = forgotPassword;
