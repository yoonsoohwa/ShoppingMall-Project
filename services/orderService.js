/* eslint-disable class-methods-use-this */
const AppError = require("../common/AppError");
const commonErrors = require("../common/commonErrors");
const { Address } = require("../models/Address");
const { Order } = require("../models/Order");
const { encrypt, decrypt } = require("../utils/crypto");

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
    const orders = await Order.find({}).populate("address");
    return orders;
  }

  decryptDetail(address) {
    const { encryptedData, authTag } = address.detail;
    return decrypt(encryptedData, authTag); // 상세주소 복호화
  }

  async getOrderById(id) {
    const order = await Order.findById(id).populate("address");

    if (order === null || order.deletedAt !== null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 주문을 찾을 수 없습니다."
      );
    }

    const decryptedDetail = this.decryptDetail(order.address);
    return { order, decryptedDetail };
  }

  async updateOrderStatus({ id, status }) {
    const order = await Order.findById;

    if (order === null || order.deletedAt !== null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 주문을 찾을 수 없습니다."
      );
    }

    const updatedOrder = await order
      .update(
        id,
        { status },
        { new: true } // 업데이트된 객체를 반환
      )
      .populate("address");

    return updatedOrder;
  }

  async updateOrderItems({ id, items }) {
    const order = await Order.findById;

    if (order === null || order.deletedAt !== null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 주문을 찾을 수 없습니다."
      );
    }

    const updatedOrder = await order.update(id, { items }, { new: true });

    return updatedOrder;
  }

  async deleteOrder(id) {
    const order = await Order.findById;

    if (order === null || order.deletedAt !== null) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 주문을 찾을 수 없습니다."
      );
    }

    const updatedOrder = await order.update(
      id,
      { deletedAt: Date.now() },
      { new: true }
    );

    return updatedOrder;
  }
}

module.exports = new OrderService();
