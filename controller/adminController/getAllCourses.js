const courseModel = require("../../model/courseModel");
const paginate = require("../../utils/paginate");

const getAllCourses = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    //fetch all courses
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

module.exports = getAllCourses;
