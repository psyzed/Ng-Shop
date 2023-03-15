function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ message: "You are not authorized!" });
  }

  if (err.name === "ValidationError") {
    return res.status(401).send({ message: err });
  }

  return res.status(500).send({
    message: "Internal Server Error, please try again later.",
  });
}

module.exports = errorHandler;
