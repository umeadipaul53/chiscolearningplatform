const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel");
const { registrationTokenModel } = require("../../model/tokenModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { generateAccessToken } = require("../../middleware/generateToken");
const { sendEmail } = require("../../utils/emailServices");

const registerUser = async (req, res, next) => {
  try {
    const { email, password, name, phone, role } = req.body;
    const year = new Date().getFullYear();

    //check if email already exist
    const user = await userModel.findOne({ email });

    if (user)
      return next(
        new AppError(
          "E-mail address you entered is already used by another user. Please enter a different E-mail address.",
          409
        )
      );

    //check if phone already exist
    const checkPhone = await userModel.findOne({ phone });

    if (checkPhone)
      return next(
        new AppError(
          "Phone number you entered is already used by another user. Please enter a different Phone number.",
          409
        )
      );

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user account
    const newUser = await userModel.create({
      email,
      phone,
      password: hashedPassword,
      name,
      role,
    });

    // generate verification token
    const token = generateAccessToken(newUser);

    //hash the generated token for security reasons
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //save the hashed token to DB
    const storeToken = await registrationTokenModel.create({
      tokenId: newUser._id,
      hash: hashedToken,
    });

    if (!storeToken) return next(new AppError("Token not saved", 400));

    //construct the verification URL
    const verifyURL = `https://www.learningapp.com/verify-user-account?token=${token}`;

    //send the verification email using resend
    const sendingEmail = await sendEmail({
      to: newUser.email,
      subject: "Welcome to Cisco learning platform",
      templateName: "welcome",
      variables: {
        name,
        verifyURL,
        year,
      },
    });

    if (!sendingEmail) {
      console.log("Failed to send verification email");
    }

    console.log("Verification email sent successfully to", newUser.email);

    return res.status(200).json({
      message:
        "Account created, kindly click on the link in your email to verify your account",
      data: {
        email: newUser.email,
        name,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = registerUser;
