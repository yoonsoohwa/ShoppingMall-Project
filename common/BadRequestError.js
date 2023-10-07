const { StatusCodes } = require('http-status-codes');
const AppError = require('./AppError');

class BadRequestError extends AppError {
  constructor(message) {
    super(message, StatusCodes.BadRequestError);
  }
}

module.exports = {
  BadRequestError,
};
