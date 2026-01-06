const userModel = require("../../model/userModel");
const paginate = require("../../utils/paginate");

const getAllStudents = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // filter users records by role
    const filter = { role: "student" };

    const { results, pagination } = await paginate({
      model: userModel,
      filter,
      page,
      limit,
      sort: "-createdAt",
      select: "-password",
    });

    res.status(200).json({
      status: "success",
      message:
        results.length > 0
          ? "All Students retrieved successfully"
          : "No students found at the moment",
      count: pagination.totalResults,
      pagination,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

const getAllInstructors = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // filter users records by role
    const filter = { role: "instructor" };

    const { results, pagination } = await paginate({
      model: userModel,
      filter,
      page,
      limit,
      sort: "-createdAt",
      select: "-password",
    });

    res.status(200).json({
      status: "success",
      message:
        results.length > 0
          ? "All instructors retrieved successfully"
          : "No instructor found at the moment",
      count: pagination.totalResults,
      pagination,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllStudents, getAllInstructors };
