const { Router } = require("express");

const { Order } = require("../models/Order");
const { Address } = require("../models/Address");
const { validateOrderStatus } = require("../middlewares/orderMiddleware");
const { encrypt, decrypt } = require("../utils/crypto");

const orderRouter = Router();

// POST /api/v1/orders
orderRouter.post("/", validateOrderStatus("body"), async (req, res, next) => {
  const { address } = req.body;

  try {
    address.detail = String(address.detail);
    address.detail = encrypt(address.detail); // detail address encrypt

    const newAddress = new Address({ ...address });
    await newAddress.save();

    const order = new Order({ ...req.body, address: newAddress });
    await order.save();

    res.status(201).json({ message: "주문이 성공적으로 이뤄졌습니다.", order });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders
orderRouter.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find().populate("address");
    res.status(200).json({ message: "전체 주문이 조회되었습니다.", orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/id
orderRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate("address");

    const { encryptedData, authTag } = order.address.detail;
    const decryptedDetail = decrypt(encryptedData, authTag);

    res.status(200).json({
      message: "주문이 성공적으로 조회되었습니다.",
      order,
      decryptedDetail,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH  /api/v1/orders/:id  update status
orderRouter.patch(
  "/:id/status",
  validateOrderStatus("body"),
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true } // 업데이트된 객체를 반환
      ).populate("address");
      res.status(200).json({
        message: `주문 상태가 ${status}(으)로 변경되었습니다.`,
        order,
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH  /api/v1/orders/:id  update item list
orderRouter.patch("/:id/items", async (req, res, next) => {
  const { id } = req.params;
  const { items } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(id, { items }, { new: true });
    res
      .status(200)
      .json({ message: "상품 목록이 성공적으로 변경되었습니다.", order });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/orders/:id
orderRouter.patch("/:id/delete", async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { deletedAt: Date.now() },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "주문이 성공적으로 삭제되었습니다.", order });
  } catch (err) {
    next(err);
  }
});

module.exports = orderRouter;
