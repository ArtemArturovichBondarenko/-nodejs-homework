const ApiError = require("./ApiError");

module.exports = (req, res, error) => {
  console.error("--------------------");
  console.error(error);
  console.error("--------------------");
  console.error(req.params, req.query, req.body);
  console.error("====================");

  if (error instanceof ApiError) {
    return res.status(error.status).send({
      message: error.message,
      data: error.message,
    });
  }

  res.status(500).send({ message: "Internal server error" });
};
