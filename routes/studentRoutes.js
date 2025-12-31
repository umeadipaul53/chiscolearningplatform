const express = require("express");
const studentRouter = express.Router();
const validate = require("../middleware/validate");
const { upload, validateFiles } = require("../config/multer");
const authenticateToken = require("../middleware/authToken");
const authorizeRoles = require("../middleware/authRole");
const courseEnrollment = require("../controller/enrollmentController/userCourseEnrollment");
const getUserCourses = require("../controller/enrollmentController/getUserCourses");
const userEnrollmentAccess = require("../controller/enrollmentController/userEnrollmentAccess");
const submitAssignment = require("../controller/assignmentController/submitAssignment");
const submitAssignmentSchema = require("../validators/assignmentValidators/submitAssignmentValidator");

studentRouter
  .route("/course-enrollment/:courseId")
  .post(authenticateToken, authorizeRoles("student"), courseEnrollment);
studentRouter
  .route("/get-user-courses")
  .get(authenticateToken, authorizeRoles("student"), getUserCourses);
studentRouter
  .route("/is-enrolled/:courseId")
  .get(authenticateToken, authorizeRoles("student"), userEnrollmentAccess);
studentRouter
  .route("/submit-assignment/:assignmentId")
  .post(
    authenticateToken,
    authorizeRoles("student"),
    upload.single("file"),
    validateFiles,
    validate(submitAssignmentSchema),
    submitAssignment
  );

module.exports = studentRouter;
