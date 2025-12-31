const courseModel = require("../../model/courseModel");
const paginate = require("../../utils/paginate");

const getInstructorCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter = { createdBy: userId };

    const { results: courses, pagination } = await paginate({
      model: courseModel,
      filter,
      page,
      limit,
      sort: "-createdAt",
    });

    res.status(200).json({
      status: "success",
      message:
        courses.length > 0
          ? "Instructor courses retrieved successfully"
          : "No courses found for this instructor",
      count: pagination.totalResults,
      pagination,
      data: courses,
    });
  } catch (err) {
    next(err);
  }
};

const getAllCourses = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const { results: courses, pagination } = await paginate({
      model: courseModel,
      page,
      limit,
      sort: "-createdAt",
      populate: { path: "createdBy", select: "name" },
    });

    res.status(200).json({
      status: "success",
      message:
        courses.length > 0
          ? "All courses retrieved successfully"
          : "No courses found",
      count: pagination.totalResults,
      pagination,
      data: courses,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInstructorCourses, getAllCourses };
