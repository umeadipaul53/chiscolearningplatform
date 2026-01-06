const express = require("express");
const tutorRouter = express.Router();
const authenticateToken = require("../middleware/authToken");
const authorizeRoles = require("../middleware/authRole");
const getInstructorCourses = require("../controller/courseController/getAllCoursesCreated");

tutorRouter
  .route("/get-instructor-courses")
  .get(authenticateToken, authorizeRoles("instructor"), getInstructorCourses);

module.exports = tutorRouter;
