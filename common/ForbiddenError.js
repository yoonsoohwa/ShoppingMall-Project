const { StatusCodes } = require('http-status-codes');
const AppError = require('./AppError');

class ForbiddenError extends AppError {
  constructor(message) {
    super(message, StatusCodes.FORBIDDEN);
  }
}

module.exports = {
  ForbiddenError,
};
