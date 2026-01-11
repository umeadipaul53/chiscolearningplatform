const express = require("express");
const authRouter = express.Router();
const validate = require("../middleware/validate");
const registerUser = require("../controller/authController/registerUser");
const validateUserRegistration = require("../validators/authValidators/registrationValidator");
const loginUser = require("../controller/authController/loginUser");
const validateUserLogin = require("../validators/authValidators/loginValidator");
const twoFactorVerification = require("../controller/authController/verifyTwoFactor");
const validateTwoFactorInput = require("../validators/authValidators/twoFactorValidator");
const verifyUserAccount = require("../controller/authController/verifyAccount");
const tokenValidator = require("../validators/authValidators/tokenValidator");
const forgotPassword = require("../controller/authController/forgotPassword");
const validateEmail = require("../validators/authValidators/emailValidator");
const {
  handleChangePassword,
  verifyChangePasswordToken,
} = require("../controller/authController/changePassword");
const validateChangePassword = require("../validators/authValidators/changePasswordValidator");
const refreshToken = require("../controller/authController/refreshUserToken");
const resendAccountVerification = require("../controller/authController/resendAccountVerification");
const resendTwoFactorCode = require("../controller/authController/resendTwoFactorCode");
const validateResendOTP = require("../validators/authValidators/validateResendOtp");

authRouter.route("/refresh-token").post(refreshToken);
authRouter.post("/register", validate(validateUserRegistration), registerUser);
authRouter
  .route("/resend-account-verification")
  .post(validate(validateEmail), resendAccountVerification);
authRouter.route("/login").post(validate(validateUserLogin), loginUser);
authRouter
  .route("/resend-2fa-code")
  .post(validate(validateResendOTP), resendTwoFactorCode);
authRouter
  .route("/two-factor-verification")
  .post(validate(validateTwoFactorInput), twoFactorVerification);
authRouter
  .route("/verify-user-account")
  .put(validate(tokenValidator, "query"), verifyUserAccount);
authRouter
  .route("/forgot-password")
  .post(validate(validateEmail), forgotPassword);
authRouter
  .route("/change-password")
  .get(validate(tokenValidator, "query"), verifyChangePasswordToken);
authRouter
  .route("/change-password")
  .put(validate(validateChangePassword), handleChangePassword);

module.exports = authRouter;
