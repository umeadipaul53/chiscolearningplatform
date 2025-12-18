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

authRouter
  .route("/register")
  .post(validate(validateUserRegistration), registerUser);
authRouter.route("/login").post(validate(validateUserLogin), loginUser);
authRouter
  .route("/two-factor-verification")
  .post(validate(validateTwoFactorInput), twoFactorVerification);
authRouter
  .route("/verify-user-account")
  .get(validate(tokenValidator), verifyUserAccount);

module.exports = authRouter;
