const express = require("express");
const studentRouter = express.Router();
const loginUser = require("../controller/authController/loginUser");

studentRouter.route("/login").post(loginUser);

module.exports = studentRouter;
