/* eslint-disable class-methods-use-this */
const { BadRequestError } = require('../common/BadRequestError');
const { NotFoundError } = require('../common/NotFoundError');
const { Address } = require('../models/Address');
const { Order } = require('../models/Order');

class OrderService {
  constructor() {
    this.ON_SHIPPING_LIST = ['배송중', '배송완료', '취소처리중', '주문취소'];
  }

  validateOnShipping(status) {
    if (this.ON_SHIPPING_LIST.includes(status))
      throw new BadRequestError(`이미 배송중인 제품은 변경 또는 취소할 수 없습니다.`);
  }

  async createOrder({ user, orderItems, address, totalPrice, status, message, orderPassword }) {
    if (!/^[a-zA-Z0-9]{8,}$/.test(orderPassword) && !user) {
      throw new BadRequestError('주문 비밀번호는 최소 8자리의 숫자와 영문자의 조합이어야 합니다.');
    }

    const order = await Order.create({
      user,
      orderItems,
      address,
      totalPrice,
      status,
      message,
      orderPassword,
    });

    return order;
  }

  async getPagination(page, limit) {
    const orders = await Order.find()
      .populate('user')
      .populate('orderItems')
      .populate('address')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments();

    return { orders, count };
  }

  async getOrderById(id) {
    const order = await Order.findById(id).populate('user').populate('orderItems').populate('address');

    if (!order) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    return order;
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

  async getPaginationByUser(user, page, limit) {
    const orders = await Order.find({ user })
      .populate('user')
      .populate('orderItems')
      .populate('address')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments({ user });

    return { orders, count };
  }

  async updateOrder(id, message, address, status, newOrderItems, totalPrice) {
    const order = await Order.findById(id);
    if (!order) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    this.validateOnShipping(order.status);

    const newAddress = await Address.findByIdAndUpdate(order.address._id, { ...address }, { new: true });
    const updateOrderData = { message, address: newAddress, status, orderItems: newOrderItems, totalPrice };

    const updatedOrder = await Order.findByIdAndUpdate(id, updateOrderData, { new: true })
      .populate('user')
      .populate('orderItems')
      .populate('address');

    return updatedOrder;
  }

  async deleteOrder(id) {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    this.validateOnShipping(order.status);

    await order.delete();
  }
}

module.exports = new OrderService();
