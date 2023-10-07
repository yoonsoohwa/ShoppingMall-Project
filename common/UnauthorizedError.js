const { StatusCodes } = require('http-status-codes');
const AppError = require('./AppError');

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

module.exports = {
  UnauthorizedError,
};
