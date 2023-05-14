function noMatchPathMiddleware(req, res, next) {
  return next("No matching path");
}

module.exports = noMatchPathMiddleware;
