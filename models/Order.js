const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      // ref: 'User'
    },
    items: [
      {
        type: mongoose.Types.ObjectId,
        // ref: 'Item'
      },
    ],
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["주문대기", "결제완료", "배송중", "배송완료"], // 이 enum 안에 있는 input이 아니면 에러 발생
      default: "주문 대기",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
