const express = require("express");
const adminRouter = express.Router();
const loginUser = require("../controller/authController/loginUser");

adminRouter.route("/login").post(loginUser);

module.exports = adminRouter;
