const AppError = require("./AppError");
const {MESSAGES} = require("../utils/constants");



const notFoundHandler = (req, res, next) => {
  const error = new AppError(`${MESSAGES.ERROR_PATH}: ${req.path}`, 404);
  next(error);
};


module.exports = {
    notFoundHandler,
};