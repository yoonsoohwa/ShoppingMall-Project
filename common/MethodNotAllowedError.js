const { StatusCodes } = require('http-status-codes');
const AppError = require('./AppError');

class MethodNotAllowedError extends AppError {
  constructor(message) {
    super(message, StatusCodes.METHOD_NOT_ALLOWED);
  }
}

module.exports = {
  MethodNotAllowedError,
};
