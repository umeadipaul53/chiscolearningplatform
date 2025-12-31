const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");
const { sendEmail } = require("../../utils/emailServices");
const twoFactorModel = require("../../model/twofactorModel");

const resendTwoFactorCode = async (req, res) => {
  try {
    const userId = req.body.id;

    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return next(new AppError("Account not found", 404));
    }

    const twoFactorCode = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      "0"
    );

    await twoFactorModel.deleteMany({ userId: user._id });

    try {
      const createFA = await twoFactorModel.create({
        userId,
        code: twoFactorCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });
    } catch (error) {
      console.error("Error creating 2FA entry:", error);
      return next(new AppError("Could not create 2FA entry", 500));
    }

    const sentMail = await sendEmail({
      to: user.email,
      subject: "2FA authentication",
      templateName: "twoFaauthentication",
      variables: {
        name: user.name,
        code: twoFactorCode,
      },
    });

    console.log("Email sent?", sentMail);

    if (!sentMail) {
      return next(new AppError("failed to send 2FA code", 500));
    }

    return res.status(200).json({
      message: "2FA Code generated successfully",
      data: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        fullname: user.name,
        role: user.role,
      },
      twofactor: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = resendTwoFactorCode;
