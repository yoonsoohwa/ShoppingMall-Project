const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    option: {
      size: String,
      color: String,
    },
    item: {
      type: mongoose.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = { OrderItem };
