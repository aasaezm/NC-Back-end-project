exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request: Invalid Input" });
  } else if (err.code === "23502") {
    res
      .status(400)
      .send({ msg: "Bad Request: Malformed body / Missing required fields" });
  } else if (err.code === "23503") {
    res.status(400).send({
      msg: "Bad Request: Either the article or the author to be input still doesn't exist in the database",
    });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error!" });
};
