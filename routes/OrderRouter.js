const { Router } = require("express");
const { Order } = require("../models/Order");
const { orderMiddleware } = require("../middlewares/orderMiddleware");

const orderRouter = Router();

// GET /api/v1/posts
orderRouter.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/posts
orderRouter.post(
  "/",
  orderMiddleware.checkOrderStatus("body"),
  async (req, res, next) => {
    const order = new Order(req.body);
    try {
      await order.save();
      res
        .status(201)
        .json({ message: "주문이 성공적으로 이뤄졌습니다.", order });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = orderRouter;
