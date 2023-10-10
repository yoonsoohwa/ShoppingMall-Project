const { Router } = require('express');

const OrderService = require('../services/orderService');
const OrderItemService = require('../services/orderItemService');
const AddressService = require('../services/addressService');
const UserService = require('../services/userService');
const { authenticateUser, authenticateAdmin } = require('../middlewares/authUserMiddlewares');
const { validateOrderStatus } = require('../middlewares/orderMiddleware');
const { BadRequestError } = require('../common/BadRequestError');
const { UnauthorizedError } = require('../common/UnauthorizedError');

const orderRouter = Router();

// POST /api/v1/orders
orderRouter.post('/', authenticateUser, validateOrderStatus('body'), async (req, res, next) => {
  const userId = req.user._id;
  const { orderItems, address, totalPrice, status, payMethod, message } = req.body;

  try {
    const user = await UserService.getUserById(userId);

    const newOrderItems = await Promise.all(
      orderItems.map(async (orderItem) => {
        const newOrderItem = await OrderItemService.createOrderItem({
          ...orderItem,
        });
        return newOrderItem;
      }),
    );

    const newAddress = await AddressService.createAddress({ ...address });

    const order = await OrderService.createOrder({
      user,
      orderItems: newOrderItems,
      address: newAddress,
      totalPrice,
      status,
      payMethod,
      message,
    });

    res.status(201).json({ message: '주문이 성공적으로 이뤄졌습니다.', order });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/orders/guest
orderRouter.post('/guest', validateOrderStatus('body'), async (req, res, next) => {
  const { orderItems, address, totalPrice, status, payMethod, message, orderPassword, confirmPassword } = req.body;

  try {
    if (orderPassword !== confirmPassword) throw new BadRequestError('비밀번호와 확인 비밀번호가 일치하지 않습니다.');

    const newOrderItems = await Promise.all(
      orderItems.map(async (orderItem) => {
        const newOrderItem = await OrderItemService.createOrderItem({
          ...orderItem,
        });
        return newOrderItem;
      }),
    );

    const newAddress = await AddressService.createAddress({ ...address });

    const order = await OrderService.createOrder({
      orderItems: newOrderItems,
      address: newAddress,
      totalPrice,
      status,
      payMethod,
      message,
      orderPassword,
    });

    res.status(201).json({ message: '주문이 성공적으로 이뤄졌습니다.', order });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders
orderRouter.get('/', authenticateAdmin, async (req, res, next) => {
  try {
    const orders = await OrderService.getOrders();
    res.status(200).json({ message: '전체 주문이 조회되었습니다.', orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/id
orderRouter.get('/:id', authenticateUser, async (req, res, next) => {
  const { email } = req.user;
  const { role } = req.user;
  const { id } = req.params;

  try {
    const { order } = await OrderService.getOrderById(id);

    if (email !== order.user.email && role !== 'admin')
      throw new UnauthorizedError('주문 정보를 조회할 권한이 없습니다.');

    res.status(200).json({
      message: '주문이 성공적으로 조회되었습니다.',
      order,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/get/guest 배송현황별 주문조회
orderRouter.get('/get/shipping', authenticateUser, async (req, res, next) => {
  const userId = req.user._id;
  const { status } = req.body;

  try {
    const orders = await OrderService.getOrdersByStatus(userId, status);

    res.status(200).json({
      message: '주문이 성공적으로 조회되었습니다.',
      orders,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/get/guest 비회원 주문조회
orderRouter.get('/get/guest', async (req, res, next) => {
  const { orderId, orderPassword } = req.body;

  try {
    const order = await OrderService.getOrderByGuest(orderId, orderPassword);

    res.status(200).json({
      message: '주문이 성공적으로 조회되었습니다.',
      order,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/order-list  pagination
orderRouter.get('/page/:page/:limit', authenticateUser, async (req, res, next) => {
  const userId = req.user._id;
  const { page = 1, limit = 20 } = req.params;

  try {
    const user = await UserService.getUserById(userId);
    const { orders, count } = await OrderService.getPagination({ user, page, limit });

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
orderRouter.patch('/:id/update', authenticateUser, async (req, res, next) => {
  const { email } = req.user;
  const { role } = req.user;
  const { id } = req.params;
  const { message, address } = req.body;

  try {
    const order = await OrderService.updateOrder({ id, message, address });

    if (email !== order.user.email && role !== 'admin')
      throw new UnauthorizedError('주문 정보를 조회할 권한이 없습니다.');

    res.status(200).json({
      message: '주문이 성공적으로 변경되었습니다.',
      order,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH  /api/v1/orders/:id  update status
orderRouter.patch('/:id/status', authenticateAdmin, validateOrderStatus('body'), async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await OrderService.updateOrderStatus({ id, status });

    if (
      (order.status === '배송중' || order.status === '배송완료') &&
      (status === '주문취소' || status === '취소처리중')
    ) {
      throw new BadRequestError('배송중이거나 배송완료된 상품은 취소할 수 없습니다.');
    }

    res.status(200).json({
      message: `주문 상태가 ${status}(으)로 변경되었습니다.`,
      order,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH  /api/v1/orders/:id  update item list
orderRouter.patch('/:id/items', authenticateUser, async (req, res, next) => {
  const { email } = req.user;
  const { role } = req.user;
  const { id } = req.params;
  const { items } = req.body;

  try {
    const order = await OrderService.updateOrderItems({ id, items });

    if (email !== order.user.email && role !== 'admin')
      throw new UnauthorizedError('주문 정보를 조회할 권한이 없습니다.');

    res.status(200).json({ message: '상품 목록이 성공적으로 변경되었습니다.', order });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/orders/:id
orderRouter.delete('/:id/delete', authenticateAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    await OrderService.deleteOrder(id);
    res.status(200).json({ message: '주문이 성공적으로 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = orderRouter;
