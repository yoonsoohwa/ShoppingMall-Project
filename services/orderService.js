/* eslint-disable class-methods-use-this */
const { BadRequestError } = require('../common/BadRequestError');
const { NotFoundError } = require('../common/NotFoundError');
const { Address } = require('../models/Address');
const { Order } = require('../models/Order');

class OrderService {
  async createOrder({ user, orderItems, address, totalPrice, status, payMethod = '가상계좌', message, orderPassword }) {
    if (!/^[a-zA-Z0-9]{8,}$/.test(orderPassword) && !user) {
      throw new BadRequestError('주문 비밀번호는 최소 8자리의 숫자와 영문자의 조합이어야 합니다.');
    }

    const order = await Order.create({
      user,
      orderItems,
      address,
      totalPrice,
      payMethod,
      status,
      message,
      orderPassword,
    });

    return order;
  }

  async getOrders() {
    const orders = await Order.find().populate('user').populate('orderItems').populate('address');
    return orders;
  }

  async getOrderById(id) {
    const order = await Order.findById(id).populate('user').populate('orderItems').populate('address');

    if (!order) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    return { order };
  }

  async getOrdersByStatus(userId, status) {
    const orders = await Order.find({ status }).populate({ path: 'user', match: { _id: userId } });

    if (!orders) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    return orders;
  }

  async getOrderByGuest(orderId, orderPassword) {
    const order = await Order.findOne({ _id: orderId, orderPassword }).populate('orderItems').populate('address');

    if (!order) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    return order;
  }

  async getPagination({ user, page, limit }) {
    const orders = await Order.find({ user })
      .populate('user')
      .populate('orderItems')
      .populate('address')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments();

    return { orders, count };
  }

  async updateOrder({ id, message, address }) {
    const order = await Order.findById(id);

    if (!order) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    const newAddress = await Address.findByIdAndUpdate(order.address._id, { ...address }, { new: true });
    const updatedOrder = await Order.findByIdAndUpdate(id, { message, newAddress }, { new: true })
      .populate('user')
      .populate('orderItems')
      .populate('address');

    return updatedOrder;
  }

  async updateOrderStatus({ id, status }) {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }, // 업데이트된 객체를 반환
    )
      .populate('user')
      .populate('orderItems')
      .populate('address');

    if (!order) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    return order;
  }

  async updateOrderItems({ id, items }) {
    const order = await Order.findByIdAndUpdate(id, { items }, { new: true });

    if (!order) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    return order;
  }

  async deleteOrder(id) {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }
  }
}

module.exports = new OrderService();
