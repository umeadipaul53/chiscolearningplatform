const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");
const isProduction = process.env.NODE_ENV === "production";
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../middleware/generateToken");
const { refreshTokenModel } = require("../../model/tokenModel");
const twoFactorModel = require("../../model/twofactorModel");

const twoFactorVerification = async (req, res, next) => {
  try {
    const code = req.body.code;
    const userId = req.body.id;

    const verifyCode = await twoFactorModel.findOne({ userId, code });

    if (!verifyCode) return next(new AppError("Invalid code", 400));

    if (Date.now() > verifyCode.expiresAt) {
      return next(new AppError("Code expired", 400));
    }

    const user = await userModel.findById(userId);

    //generate a token id for the user
    const newTokenId = crypto.randomUUID();

    //genrate access and refresh token for the user
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
      message: "2FA Verification successful",
      data: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        fullname: user.name,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = twoFactorVerification;
