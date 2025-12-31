const AppError = require("../../utils/AppError");
const jwt = require("jsonwebtoken");
const userModel = require("../../model/userModel");
const isProduction = process.env.NODE_ENV === "production";
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../middleware/generateToken");
const { refreshTokenModel } = require("../../model/tokenModel");

const refreshToken = async (req, res, next) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!refreshTokenCookie) return next(new AppError("No refresh token", 400));

    let decoded;
    try {
      decoded = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return next(new AppError("Invalid Token", 403));
    }

    if (!decoded.tokenId)
      return next(new AppError("Missing token ID in refresh token", 400));

    const savedToken = await refreshTokenModel.findOne({
      tokenId: decoded.tokenId,
      userId: decoded.id,
      token: refreshTokenCookie,
    });

    if (!savedToken)
      return next(new AppError("Refresh token reuse detected", 403));

    // Delete old refresh token
    await refreshTokenModel.deleteOne({ tokenId: decoded.tokenId });

    const user = await userModel.findById(decoded.id);

    if (!user) return next(new AppError("User not found", 400));

    //generate new accesstoken
    const accessToken = generateAccessToken(user);

    //generate a token id for the user
    const newtokenId = crypto.randomUUID();

    //generate new refresh token
    const newRefreshToken = generateRefreshToken(user, newtokenId);

    //save new refresh token
    await refreshTokenModel.create({
      tokenId: newtokenId,
      token: newRefreshToken,
      userId: user._id,
    });

    // Send back new tokens
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      partitioned: isProduction ? true : false, // ⭐ REQUIRED ⭐
      path: "/", // more flexible for refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

module.exports = refreshToken;
