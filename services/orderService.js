/* eslint-disable class-methods-use-this */
const { NotFoundError } = require('../common/NotFoundError');
const { Address } = require('../models/Address');
const { Order } = require('../models/Order');
const { encrypt, decrypt } = require('../utils/crypto');

class OrderService {
  async createOrder({ address, totalPrice, status }) {
    const encryptedDetail = encrypt(address.detail); // 상세 주소 암호화

    const newAddress = await Address.create({
      ...address,
      detail: encryptedDetail,
    });

    const order = await Order.create({
      totalPrice,
      status,
      address: newAddress,
    });

    return order;
  }

  async getOrders() {
    const orders = await Order.find({}).populate('address');
    return orders;
  }

  decryptDetail(address) {
    const { encryptedData, authTag } = address.detail;
    return decrypt(encryptedData, authTag); // 상세주소 복호화
  }

  async getOrderById(id) {
    const order = await Order.findById(id).populate('address');

    if (order === null || order.deletedAt !== null) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    const decryptedDetail = this.decryptDetail(order.address);
    return { order, decryptedDetail };
  }

  async updateOrderStatus({ id, status }) {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }, // 업데이트된 객체를 반환
    ).populate('address');

    if (!order || order.deletedAt !== null) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    return order;
  }

  async updateOrderItems({ id, items }) {
    const order = await Order.findByIdAndUpdate(id, { items }, { new: true });

    if (order === null || order.deletedAt !== null) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    return order;
  }

  async deleteOrder(id) {
    const order = await Order.findById(id);

    if (!order || order.deletedAt !== null) {
      throw new NotFoundError('해당 주문을 찾을 수 없습니다.');
    }

    const deletedOrder = await Order.findByIdAndUpdate(id, { deletedAt: Date.now() }, { new: true }).populate(
      'address',
    );

    return deletedOrder;
  }
}

module.exports = new OrderService();
