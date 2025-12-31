const express = require("express");
const adminRouter = express.Router();
const authenticateToken = require("../middleware/authToken");
const authorizeRoles = require("../middleware/authRole");
const {
  getAllCourses,
} = require("../controller/courseController/getAllCoursesCreated");

adminRouter
  .route("/all-courses-created")
  .get(authenticateToken, authorizeRoles("admin"), getAllCourses);

module.exports = adminRouter;
