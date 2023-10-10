const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    item: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = { OrderItem };
