const { Router } = require('express');

const OrderService = require('../services/orderService');
const OrderItemService = require('../services/orderItemService');
const AddressService = require('../services/addressService');
const UserService = require('../services/userService');
const { authenticateUser, authenticateAdmin } = require('../middlewares/authUserMiddlewares');
const { validateOrderStatus, validateOnShipping } = require('../middlewares/orderMiddleware');
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

    res.status(201).json({ message: '주문이 완료되었습니다.', order });
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

    res.status(201).json({ message: '주문이 완료되었습니다.', order });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders
orderRouter.get('/:page/:limit', authenticateAdmin, async (req, res, next) => {
  const { page = 1, limit = 20 } = req.params;

  try {
    const orders = await OrderService.getPagination(page, limit);
    res.status(200).json({ message: '주문 조회에 성공하였습니다.', orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/id
orderRouter.get('/:id', authenticateUser, async (req, res, next) => {
  const { email, role } = req.user;
  const { id } = req.params;

  try {
    const { order } = await OrderService.getOrderById(id);

    if (email !== order.user.email && role !== 'admin')
      throw new UnauthorizedError('주문 정보를 조회할 권한이 없습니다.');

    res.status(200).json({
      message: '주문 조회에 성공하였습니다.',
      order,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/get/guest 배송현황별 주문조회
orderRouter.post('/shipping', authenticateUser, async (req, res, next) => {
  const userId = req.user._id;
  const { status } = req.body;

  try {
    const orders = await OrderService.getOrdersByStatus(userId, status);

    res.status(200).json({
      message: '주문 조회에 성공하였습니다.',
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
      message: '주문 조회에 성공하였습니다.',
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
    const { orders, count } = await OrderService.getPaginationByUser({ user, page, limit });

    res.status(200).json({
      message: '주문 조회에 성공하였습니다.',
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH  /api/v1/orders/:id/update  update address and message
orderRouter.patch('/:id/update', authenticateUser, async (req, res, next) => {
  const { email, role } = req.user;
  const { id } = req.params;
  const { message, address, status, orderItems, totalPrice } = req.body;

  try {
    let newOrderItems;
    if (orderItems) {
      newOrderItems = await Promise.all(
        orderItems.map(async (orderItem) => {
          const newOrderItem = await OrderItemService.createOrderItem({
            ...orderItem,
          });
          return newOrderItem;
        }),
      );
    }

    const order = await OrderService.updateOrder({ id, message, address, status, newOrderItems, totalPrice });

    if (email !== order.user.email && role !== 'admin')
      throw new UnauthorizedError('주문 정보를 조회할 권한이 없습니다.');

    res.status(200).json({
      message: '주문 정보가 변경되었습니다.',
      order,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/orders/:id/delete
orderRouter.delete('/:id/delete', authenticateAdmin, validateOnShipping('body'), async (req, res, next) => {
  const { id } = req.params;
  try {
    await OrderService.deleteOrder(id);
    res.status(200).json({ message: '주문이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = orderRouter;
