const { BadRequestError } = require('../common/BadRequestError');

const STATUS_LIST = ['주문대기', '결제완료', '배송준비중', '배송중', '배송완료', '취소처리중', '주문취소'];
const ON_SHIPPING_LIST = ['배송중', '배송완료', '취소처리중', '주문취소'];

// status가 알맞게 들어왔는지 검사하는 미들웨어
const validateOrder = (from) => (req, res, next) => {
  const { status } = req[from];

  if (!STATUS_LIST.includes(status)) {
    next(
      new BadRequestError(
        `${from}: status는 "주문대기", "결제완료", '배송준비중', "배송중", "배송완료", '취소처리중', '주문취소' 중 하나여야 합니다.`,
      ),
    );
    return;
  }
  next();
};

const validateOnShipping = (from) => (req, res, next) => {
  const { status } = req[from];

  if (ON_SHIPPING_LIST.includes(status)) {
    next(new BadRequestError(`이미 배송중인 제품은 변경 또는 취소할 수 없습니다.`));
    return;
  }
  next();
};

module.exports = {
  validateOrder,
  validateOnShipping,
};
