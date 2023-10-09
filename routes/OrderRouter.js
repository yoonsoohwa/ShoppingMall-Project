const { Router } = require('express');

const OrderService = require('../services/orderService');
const OrderItemService = require('../services/orderItemService');
const { validateOrderStatus } = require('../middlewares/orderMiddleware');
const { BadRequestError } = require('../common/BadRequestError');

const orderRouter = Router();

// POST /api/v1/orders
orderRouter.post('/', validateOrderStatus('body'), async (req, res, next) => {
  const { orderItems, orderInfo } = req.body;

  try {
    const newOrderItems = await Promise.all(
      orderItems.map(async (orderItem) => {
        const newOrderItem = await OrderItemService.createOrderItem({
          ...orderItem,
        });
        return newOrderItem;
      }),
    );

    const order = await OrderService.createOrder({
      orderItems: newOrderItems,
      ...orderInfo,
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

// PATCH  /api/v1/orders/:id  update address and message
orderRouter.patch('/:id/update', async (req, res, next) => {
  const { id } = req.params;
  const { message, address } = req.body;

  try {
    const order = await OrderService.updateOrder({ id, message, address });
    res.status(200).json({
      message: `주문 상태가 ${order.status}(으)로 변경되었습니다.`,
      order,
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
    const order = await OrderService.findById(id);

    if (
      (order.status === '배송중' || order.status === '배송완료') &&
      (status === '주문취소' || status === '취소처리중')
    ) {
      throw new BadRequestError('배송중이거나 배송완료된 상품은 취소할 수 없습니다.');
    }

    const updatedOrder = await OrderService.updateOrderStatus({ id, status });
    res.status(200).json({
      message: `주문 상태가 ${status}(으)로 변경되었습니다.`,
      updatedOrder,
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
