/**
 * 기존 에러 클래스를 확장한 AppError 클래스
 * 한인호 코치님 강의자료 중 0919 05_board_api에 있는 코드 참조
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

module.exports = AppError;
