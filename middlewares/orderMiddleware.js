const { BadRequestError } = require('../common/BadRequestError');

// status가 알맞게 들어왔는지 검사하는 미들웨어
const validateOrderStatus = (from) => (req, res, next) => {
  const { status } = req[from];

  if (status !== '주문대기' && status !== '결제완료' && status !== '배송중' && status !== '배송완료') {
    next(new BadRequestError(`${from}: status는 "주문대기", "결제완료", "배송중", "배송완료" 중 하나여야 합니다.`));
    return;
  }
  next();
};

module.exports = {
  validateOrderStatus,
};
