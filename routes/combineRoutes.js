const express = require("express");
const combineRouter = express.Router();
const validate = require("../middleware/validate");
const authenticateToken = require("../middleware/authToken");
const authorizeRoles = require("../middleware/authRole");
const { upload, validateFiles } = require("../config/multer");
const getUserDetails = require("../controller/userController/getUserDetails");
const getUserProfile = require("../controller/userController/getUserProfile");
const profileUpdate = require("../controller/userController/profileUpdate");
const profileValidator = require("../validators/authValidators/profileUpdateValidator");
const createCourse = require("../controller/courseController/createCourse");
const createCourseSchema = require("../validators/courseValidators/createCourseValidator");
const updateCourse = require("../controller/courseController/updateCourse");
const updateCourseSchema = require("../validators/courseValidators/updateCourseValidator");
const deleteCourse = require("../controller/courseController/deleteCourse");
const addLesson = require("../controller/lessonController/addLesson");
const validateLesson = require("../validators/lessonValidators/addLessonValidator");
const getAllCourseLessons = require("../controller/lessonController/getLesson");
const deleteLesson = require("../controller/lessonController/deleteLesson");
const updateLesson = require("../controller/lessonController/updateLesson");
const validateLessonUpdate = require("../validators/lessonValidators/updateLessonValidator");
const createAssignment = require("../controller/assignmentController/createAssignment");
const validateAssignment = require("../validators/assignmentValidators/createAssignmentValidator");
const getAllCourseAssignments = require("../controller/assignmentController/getAssignment");
const getSubmittedAssignments = require("../controller/assignmentController/getAllSubmissions");
const createQuiz = require("../controller/quizController/createQuiz");
const createQuizSchema = require("../validators/quizValidators/createQuizValidator");
const getAllQuizzes = require("../controller/quizController/getAllQuizzes");
const {
  getAllQuizResult,
} = require("../controller/quizController/getQuizResult");

combineRouter
  .route("/get-user-details")
  .get(
    authenticateToken,
    authorizeRoles("student", "instructor", "admin"),
    getUserDetails
  );
combineRouter
  .route("/user-profile")
  .get(
    authenticateToken,
    authorizeRoles("student", "instructor", "admin"),
    getUserProfile
  );
combineRouter
  .route("/update-profile")
  .put(
    authenticateToken,
    authorizeRoles("student", "instructor", "admin"),
    validate(profileValidator),
    profileUpdate
  );
combineRouter
  .route("/create-course")
  .post(
    authenticateToken,
    authorizeRoles("instructor", "admin"),
    validate(createCourseSchema),
    createCourse
  );
combineRouter
  .route("/update-course/:id")
  .post(
    authenticateToken,
    authorizeRoles("instructor", "admin"),
    validate(updateCourseSchema),
    updateCourse
  );
combineRouter
  .route("/delete-course/:id")
  .delete(
    authenticateToken,
    authorizeRoles("instructor", "admin"),
    deleteCourse
  );
combineRouter
  .route("/add-course-lesson")
  .post(
    authenticateToken,
    authorizeRoles("instructor", "admin"),
    validate(validateLesson),
    upload.array("files", 10),
    validateFiles,
    addLesson
  );
combineRouter
  .route("/get-all-course-lessons/:courseId")
  .get(
    authenticateToken,
    authorizeRoles("student", "instructor", "admin"),
    getAllCourseLessons
  );
combineRouter
  .route("/delete-lesson/:lessonId")
  .delete(
    authenticateToken,
    authorizeRoles("instructor", "admin"),
    deleteLesson
  );
combineRouter
  .route("/update-lesson/:lessonId")
  .put(
    authenticateToken,
    authorizeRoles("instructor", "admin"),
    validate(validateLessonUpdate),
    upload.array("files", 10),
    validateFiles,
    updateLesson
  );
combineRouter
  .route("/create-assignment/:courseId")
  .post(
    authenticateToken,
    authorizeRoles("instructor", "admin"),
    validate(validateAssignment),
    createAssignment
  );
combineRouter
  .route("/get-course-assignments/:courseId")
  .get(
    authenticateToken,
    authorizeRoles("student", "instructor", "admin"),
    getAllCourseAssignments
  );
combineRouter
  .route("/get-submitted-assignments/:assignmentId")
  .get(
    authenticateToken,
    authorizeRoles("instructor", "admin"),
    getSubmittedAssignments
  );
combineRouter
  .route("/create-quiz")
  .post(
    authenticateToken,
    authorizeRoles("instructor", "admin"),
    validate(createQuizSchema),
    createQuiz
  );
combineRouter
  .route("/get-all-quizzes")
  .get(
    authenticateToken,
    authorizeRoles("student", "instructor", "admin"),
    getAllQuizzes
  );
combineRouter
  .route("/get-quiz-results")
  .get(
    authenticateToken,
    authorizeRoles("instructor", "admin"),
    getAllQuizResult
  );

module.exports = combineRouter;
