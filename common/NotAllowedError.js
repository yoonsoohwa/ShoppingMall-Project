const StatusCodes = require('http-status-codes');
const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(message) {
    super(message, StatusCodes.METHOD_NOT_ALLOWED);
  }
}

module.exports = {
  NotFoundError,
};
