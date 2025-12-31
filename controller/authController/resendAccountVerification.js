const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");
const { registrationTokenModel } = require("../../model/tokenModel");
const crypto = require("crypto");
const { generateAccessToken } = require("../../middleware/generateToken");
const { sendEmail } = require("../../utils/emailServices");

const resendAccountVerification = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return next(new AppError("Email address not found", 400));

    if (user.verifyAccount)
      return next(
        new AppError(
          "Your account has been verified already, proceed to login with your details",
          400
        )
      );

    const token = generateAccessToken(user);

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    await registrationTokenModel.create({
      tokenId: user._id,
      hash: hashed,
    });

    const verifyURL = `https://chisco.softcodemicrosystem.com/verify-user-account?token=${token}`;

    const sentMail = await sendEmail({
      to: user.email,
      subject: "Welcome to CHISCO learning platform",
      templateName: "welcome",
      variables: {
        name: user.name,
        verifyURL,
        year,
      },
    });

    if (!sentMail) {
      console.error("❌ Failed to send verification email.");
      return next(new AppError("Failed to send verification email", 400));
    }

    console.log("✅ Verification email sent successfully to:", user.email);

    return res.status(200).json({
      message: "Account verification email resent",
      data: token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = resendAccountVerification;
