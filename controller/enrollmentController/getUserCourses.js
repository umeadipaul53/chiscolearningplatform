const enrollmentModel = require("../../model/enrollmentModel");
const paginate = require("../../utils/paginate");

const getUserCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter = { userId };

    const { results, pagination } = await paginate({
      model: enrollmentModel,
      filter,
      page,
      limit,
      sort: "-createdAt",
      populate: {
        path: "courseId",
        select: "title thumbnail level category",
      },
    });

    res.status(200).json({
      status: "success",
      message:
        results.length > 0
          ? "User enrolled courses retrieved successfully"
          : "User has not enrolled in any course",
      count: pagination.totalResults,
      pagination,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getUserCourses;
