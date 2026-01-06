const express = require("express");
const adminRouter = express.Router();
const authenticateToken = require("../middleware/authToken");
const authorizeRoles = require("../middleware/authRole");
const getAllCourses = require("../controller/adminController/getAllCourses");
const {
  getAllStudents,
  getAllInstructors,
} = require("../controller/adminController/getUsers");
const {
  deleteStudent,
  deleteInstructor,
} = require("../controller/adminController/deleteUser");
const approveInstructorAccount = require("../controller/adminController/approveInstructorAccount");

adminRouter
  .route("/all-courses-created")
  .get(authenticateToken, authorizeRoles("admin"), getAllCourses);
adminRouter
  .route("/all-students")
  .get(authenticateToken, authorizeRoles("admin"), getAllStudents);
adminRouter
  .route("/all-instructors")
  .get(authenticateToken, authorizeRoles("admin"), getAllInstructors);
adminRouter
  .route("/delete-student/:id")
  .delete(authenticateToken, authorizeRoles("admin"), deleteStudent);
adminRouter
  .route("/delete-instructor/:id")
  .delete(authenticateToken, authorizeRoles("admin"), deleteInstructor);
adminRouter
  .route("/activate-instructor-account/:id")
  .put(authenticateToken, authorizeRoles("admin"), approveInstructorAccount);

module.exports = adminRouter;
