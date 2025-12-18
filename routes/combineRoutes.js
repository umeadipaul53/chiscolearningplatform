const express = require("express");
const combineRouter = express.Router();
const loginUser = require("../controller/authController/loginUser");

combineRouter.route("/login").post(loginUser);

module.exports = combineRouter;
