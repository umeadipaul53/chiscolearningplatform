const express = require("express");
const tutorRouter = express.Router();
const loginUser = require("../controller/authController/loginUser");

tutorRouter.route("/login").post(loginUser);

module.exports = tutorRouter;
