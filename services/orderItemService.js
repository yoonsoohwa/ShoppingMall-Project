const { OrderItem } = require('../models/OrderItem');

class OrderItemService {
  // eslint-disable-next-line class-methods-use-this
  async createOrderItem({ quantity, option, item }) {
    const newOrderItem = await OrderItem.create({
      quantity,
      option,
      item,
    });

    return newOrderItem;
  }
}

module.exports = new OrderItemService();
