const { Router } = require('express');

const OrderService = require('../services/orderService');
const { validateOrderStatus } = require('../middlewares/orderMiddleware');

const orderRouter = Router();

// POST /api/v1/orders
orderRouter.post('/', validateOrderStatus('body'), async (req, res, next) => {
  const { address, isRegistered, totalPrice, status } = req.body;

  try {
    const order = await OrderService.createOrder({
      // userId,
      // items,
      isRegistered,
      address,
      totalPrice,
      status,
    });
    res.status(201).json({ message: '주문이 성공적으로 이뤄졌습니다.', order });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders
orderRouter.get('/', async (req, res, next) => {
  try {
    const orders = await OrderService.getOrders();
    res.status(200).json({ message: '전체 주문이 조회되었습니다.', orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/id
orderRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const { order, decryptedDetail } = await OrderService.getOrderById(id);
    res.status(200).json({
      message: '주문이 성공적으로 조회되었습니다.',
      order,
      decryptedDetail,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/order-list  pagination
orderRouter.get('/page/:page/:limit', async (req, res, next) => {
  const { page = 1, limit = 20 } = req.params;

  try {
    const { orders, count } = await OrderService.getPagination({ page, limit });
    res.status(200).json({
      message: '주문이 성공적으로 조회되었습니다.',
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH  /api/v1/orders/:id  update status
orderRouter.patch('/:id/status', validateOrderStatus('body'), async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await OrderService.updateOrderStatus({ id, status });
    res.status(200).json({
      message: `주문 상태가 ${status}(으)로 변경되었습니다.`,
      order,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH  /api/v1/orders/:id  update item list
orderRouter.patch('/:id/items', async (req, res, next) => {
  const { id } = req.params;
  const { items } = req.body;
  try {
    const order = await OrderService.updateOrderItems({ id, items });
    res.status(200).json({ message: '상품 목록이 성공적으로 변경되었습니다.', order });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/orders/:id
orderRouter.patch('/:id/delete', async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await OrderService.deleteOrder(id);
    res.status(200).json({ message: '주문이 성공적으로 삭제되었습니다.', order });
  } catch (err) {
    next(err);
  }
});

module.exports = orderRouter;
