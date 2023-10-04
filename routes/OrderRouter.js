const { Router } = require("express");
const { Order } = require("../models/Order");
const { validateOrderStatus } = require("../middlewares/orderMiddleware");

const orderRouter = Router();

// POST /api/v1/orders
orderRouter.post("/", validateOrderStatus("body"), async (req, res, next) => {
  const order = new Order(req.body);
  try {
    await order.save();
    res.status(201).json({ message: "주문이 성공적으로 이뤄졌습니다.", order });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders
orderRouter.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ message: "전체 주문이 조회되었습니다.", orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/:id
orderRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.findById({ id });
    res
      .status(200)
      .json({ message: "주문이 성공적으로 조회되었습니다.", order });
  } catch (err) {
    next(err);
  }
});

// UPDATE  /api/v1/orders/:id  update status
orderRouter.update("/:id", async (req, res, next) => {
  const { id, status } = req.params;
  try {
    await Order.findByIdAndUpdate(id, { status });
    res.status(200).json({ message: "주문이 성공적으로 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

// UPDATE  /api/v1/orders/:id  update item list
orderRouter.update("/:id", async (req, res, next) => {
  const { id, items } = req.params;
  try {
    await Order.findByIdAndUpdate(id, { items });
    res.status(200).json({ message: "주문이 성공적으로 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/orders/:id
orderRouter.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await Order.findByIdAndUpdate(id, { deletedAt: Date.now() });
    res.status(200).json({ message: "주문이 성공적으로 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

module.exports = orderRouter;
