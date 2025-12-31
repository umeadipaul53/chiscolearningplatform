const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");
const isProduction = process.env.NODE_ENV === "production";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../middleware/generateToken");
const { sendEmail } = require("../../utils/emailServices");
const { refreshTokenModel } = require("../../model/tokenModel");
const twoFactorModel = require("../../model/twofactorModel");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const user = await userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return next(
        new AppError(
          "The password does not match the user account or the account does not exist. Please verify both the email address and password and try again.",
          401
        )
      );

    //check if account has been verified
    if (user.verifyAccount === false)
      return next(
        new AppError(
          "Your account has not been verified, kindly check your mail for the verification link and try again"
        )
      );

    //generate unique token id
    const newTokenId = crypto.randomUUID();

    //check the status of 2fa setup if its not set to true login the user else generate 2fa code and send to email
    if (user.twofactorStatus === false) {
      //generate accesstoken and refreshtoken
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user, newTokenId);

      //save refresh token to DB
      try {
        const saveToken = await refreshTokenModel.create({
          tokenId: newTokenId,
          token: refreshToken,
          userId: user._id,
        });

        console.log("Token saved");
      } catch (err) {
        console.log("Token not saved: error", err);
        return next(err);
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        partitioned: isProduction ? true : false, // ⭐ REQUIRED ⭐
        path: "/", // more flexible for refresh endpoint
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        message: "Login successful",
        data: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          fullname: user.name,
          role: user.role,
        },
        accessToken,
        twofactor: false,
      });
    } else {
      //delete all 2facode existing for the user
      await twoFactorModel.deleteMany({ userId: user._id });

      //generate the code
      const twoFactorCode = String(
        Math.floor(Math.random() * 1000000)
      ).padStart(6, "0");

      try {
        // save code to DB
        const createFA = await twoFactorModel.create({
          userId: user._id,
          code: twoFactorCode,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
      } catch (err) {
        console.error("Error creating 2FA entry:", err);
        return next(err);
      }

      //send the code to email
      const sendingEmail = await sendEmail({
        to: user.email,
        subject: "2FA Authentication",
        templateName: "twoFaauthentication",
        variables: {
          name: user.name,
          code: twoFactorCode,
        },
      });

      console.log("Email sent?", sendingEmail);

      if (!sendingEmail) {
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
    }
  } catch (err) {
    next(err);
  }
};

module.exports = loginUser;
