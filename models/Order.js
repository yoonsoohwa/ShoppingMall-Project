const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    orderItems: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'OrderItem',
      },
    ],
    address: {
      type: mongoose.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    payMethod: {
      type: String,
      default: '가상계좌',
      required: true,
    },
    status: {
      type: String,
      enum: ['주문대기', '결제완료', '배송준비중', '배송중', '배송완료', '취소처리중', '주문취소'], // 이 enum 안에 있는 input이 아니면 에러 발생
      default: '주문대기',
    },
    message: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };
