const StatusCodes = require('http-status-codes');
const AppError = require('./AppError');

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, StatusCodes.UnauthorizedError);
  }
}

module.exports = {
  UnauthorizedError,
};
