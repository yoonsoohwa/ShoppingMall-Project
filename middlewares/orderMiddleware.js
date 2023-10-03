const AppError = require("../common/AppError");
const commonErrors = require("../common/commonErrors");

const validateOrderStatus = (from) => (req, res, next) => {
  const { status } = req[from];

  if (status !== "주문대기" || status !== "주문완료") {
    next(
      new AppError(
        commonErrors.requestValidationError,
        `${from}: status는 "주문대기", "주문완료" 중 하나여야 합니다.`,
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
