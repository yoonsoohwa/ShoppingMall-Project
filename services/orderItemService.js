const { NotFoundError } = require('../common/NotFoundError');
const { OrderItem } = require('../models/OrderItem');

class OrderItemService {
  // eslint-disable-next-line class-methods-use-this
  async createOrderItem({ quantity, option, item }) {
    const orderItem = await OrderItem.create({
      quantity,
      option,
      item,
    });

    if (!orderItem) {
      throw new NotFoundError('주문 상품을 찾을 수 없습니다.');
    }

    return orderItem;
  }
}

module.exports = new OrderItemService();
