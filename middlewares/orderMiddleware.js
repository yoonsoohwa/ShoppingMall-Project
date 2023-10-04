const AppError = require("../common/AppError");
const commonErrors = require("../common/commonErrors");

// status가 알맞게 들어왔는지 검사하는 미들웨어
const validateOrderStatus = (from) => (req, res, next) => {
  const { status } = req[from];

  if (status !== "주문대기" && status !== "결제완료") {
    next(
      new AppError(
        commonErrors.requestValidationError,
        `${from}: status는 "주문대기", "결제완료" 중 하나여야 합니다.`,
        400
      )
    );
    return;
  }
  next();
};

module.exports = {
  validateOrderStatus,
};
