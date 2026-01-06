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
const getQuizQuestions = require("../controller/quizController/getAQuiz");
const startQuiz = require("../controller/quizController/startQuiz");
const saveAnswerPerQuestion = require("../controller/quizController/attemptQuiz");
const submitQuiz = require("../controller/quizController/submitQuiz");
const saveAnswerValidator = require("../validators/quizValidators/saveAnswerValidator");
const { getQuizResult } = require("../controller/quizController/getQuizResult");
const markLessonCompleted = require("../controller/progressTrackingController/markLessonCompleted");
const getCourseProgress = require("../controller/progressTrackingController/courseProgress");

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
studentRouter
  .route("/get-quiz-question/:id")
  .get(authenticateToken, authorizeRoles("student"), getQuizQuestions);
studentRouter
  .route("/start-quiz/:quizId")
  .post(authenticateToken, authorizeRoles("student"), startQuiz);
studentRouter
  .route("/save-quiz-answer")
  .post(
    authenticateToken,
    authorizeRoles("student"),
    validate(saveAnswerValidator),
    saveAnswerPerQuestion
  );
studentRouter
  .route("/submit-quiz")
  .post(authenticateToken, authorizeRoles("student"), submitQuiz);
studentRouter
  .route("/get-quiz-result")
  .get(authenticateToken, authorizeRoles("student"), getQuizResult);
studentRouter
  .route("/mark-lesson-completed")
  .post(authenticateToken, authorizeRoles("student"), markLessonCompleted);
studentRouter
  .route("/get-course-progress")
  .get(authenticateToken, authorizeRoles("student"), getCourseProgress);

module.exports = studentRouter;
