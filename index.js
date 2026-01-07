const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const AppError = require("./utils/AppError");
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 4500;

const globalErrorHandler = require("./middleware/errorHandler");
const { applySecurity } = require("./middleware/security");
const connectDB = require("./config/db");

//connect DB
connectDB();

//security middleware
applySecurity(app);

//logging
app.use(morgan(isProduction ? "combined" : "dev"));

// --- Body parses (for all normal routes) ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("trust proxy", 1);

//Routes
const authRouter = require("./routes/authRoutes");
const combineRouter = require("./routes/combineRoutes");
const adminRouter = require("./routes/adminRoutes");
const studentRouter = require("./routes/studentRoutes");
const tutorRouter = require("./routes/tutorRoutes");

// default server test route
app.get("/", (req, res) => {
  res.status().json({ message: "server up and running", data: isProduction });
});

// ---- api routes ----
app.use("/api/auth/v1", authRouter);
app.use("/api/combine/v1", combineRouter);
app.use("/api/admin/v1", adminRouter);
app.use("/api/student/v1", studentRouter);
app.use("/api/tutor/v1", tutorRouter);

// ---404 handler---
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// ---- Global Error Handler ----
app.use(globalErrorHandler);

// ---- start server ----
app.listen(port, () => console.log(`Server running on PORT: ${port}`));
