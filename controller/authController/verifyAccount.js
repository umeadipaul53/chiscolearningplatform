const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");
const jwt = require("jsonwebtoken");
const { registrationTokenModel } = require("../../model/tokenModel");
const crypto = require("crypto");

const verifyUserAccount = async (req, res, next) => {
  try {
    const { token } = req.query;

    //hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //check if the hashed token is available in the database
    const checkTokenAvailability = await registrationTokenModel.findOne({
      hash: hashedToken,
    });

    if (!checkTokenAvailability)
      return next(new AppError("Token invalid", 400));

    //verify the token with JWT
    let decodeToken;
    try {
      decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token expired", 400));
      }

      if (err.name === "JsonWebTokenError") {
        return next(new AppError("Invalid token", 400));
      }
      return next(err);
    }

    //update the field verifyAccount to true once the token has been verified
    await userModel.updateOne({ _id: decodeToken.id }, { verifyAccount: true });

    //delete the token once its verified and user account has been verified

    await registrationTokenModel.deleteMany({ tokenId: decodeToken.id });

    res.status(200).json({
      message:
        "Your account has been verified, you can now login to your account with your login details",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = verifyUserAccount;
