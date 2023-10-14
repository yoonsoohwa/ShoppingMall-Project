const { Router } = require('express');
const OrderService = require('../services/orderService');
const OrderItemService = require('../services/orderItemService');
const AddressService = require('../services/addressService');
const UserService = require('../services/userService');
const { authenticateUser, authenticateAdmin } = require('../middlewares/authUserMiddlewares');
const { validateOrder, validateOnShipping } = require('../middlewares/orderMiddleware');
const { sendMail } = require('../utils/sendMail');
const { BadRequestError } = require('../common/BadRequestError');

const orderRouter = Router();

// POST /api/v1/orders
orderRouter.post('/', authenticateUser, validateOrder('body'), async (req, res, next) => {
  const userId = req.user._id;
  const { orderItems, address, totalPrice, status, message } = req.body;

  try {
    const user = await UserService.getUserById(userId);
    const newOrderItems = await Promise.all(orderItems.map(OrderItemService.createOrderItem));
    const newAddress = await AddressService.createAddress(address);

    const order = await OrderService.createOrder({
      user,
      orderItems: newOrderItems,
      address: newAddress,
      totalPrice,
      status,
      message,
    });

    // 이메일 전송
    await sendMail(user.email, '[RE: BIRTH] 상품 주문번호 발송 메일입니다.', `주문번호: ${order._id}`);

    res.status(201).json({ message: '주문이 완료되었습니다.', order });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/orders/guest
orderRouter.post('/guest', validateOrder('body'), async (req, res, next) => {
  const { orderItems, totalPrice, email, status, message, address } = req.body;

  try {
    const newOrderItems = await Promise.all(orderItems.map(OrderItemService.createOrderItem));
    const newAddress = await AddressService.createAddress(address);

    if (orderItems.length === 0) throw new BadRequestError('상품을 선택해주세요.');
    if (!address) throw new BadRequestError('주소를 입력해주세요.');

    const order = await OrderService.createOrder({
      orderItems: newOrderItems,
      address: newAddress,
      totalPrice,
      status,
      message,
    });

    // 이메일 전송
    await sendMail(email, '[RE: BIRTH] 상품 주문번호 발송 메일입니다.', `주문번호: ${order._id}`);

    res.status(201).json({ message: '주문이 완료되었습니다.', order });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders
orderRouter.get('/:page/:limit', authenticateAdmin, async (req, res, next) => {
  const { page = 1, limit = 20 } = req.params;

  try {
    const { orders, count } = await OrderService.getPagination(page, limit);
    res.status(200).json({
      message: '주문 조회에 성공하였습니다.',
      orders,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/id
orderRouter.get('/:id', authenticateUser, async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await OrderService.getOrderById(id);

    res.status(200).json({
      message: '주문 조회에 성공하였습니다.',
      order,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/shipping 배송현황별 주문조회
orderRouter.post('/shipping/:page/:limit', authenticateUser, async (req, res, next) => {
  const userId = req.user._id;
  const { status, page = 1, limit = 20 } = req.body;

  try {
    const { orders, count } = await OrderService.getOrdersByStatus(userId, status, page, limit);

    res.status(200).json({
      message: '주문 조회에 성공하였습니다.',
      orders,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/get/guest 비회원 주문조회
orderRouter.post('/get/guest', async (req, res, next) => {
  const { orderId } = req.body;

  try {
    const order = await OrderService.getOrderByGuest(orderId);

    res.status(200).json({
      message: '주문 조회에 성공하였습니다.',
      order,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/orders/order-list  pagination
orderRouter.post('/page/:page/:limit', authenticateUser, async (req, res, next) => {
  const userId = req.user._id;
  const { page = 1, limit = 20 } = req.params;

  try {
    const { orders, count } = await OrderService.getPaginationByUser({ userId, page, limit });

    res.status(200).json({
      message: '주문 조회에 성공하였습니다.',
      orders,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH  /api/v1/orders/:id/update  update address and message
orderRouter.patch('/:id/update', authenticateUser, validateOrder('body'), async (req, res, next) => {
  const { id } = req.params;
  const { message, address, status, orderItems, totalPrice } = req.body;

  try {
    const newOrderItems = await Promise.all(orderItems.map(OrderItemService.createOrderItem));
    const updatedOrder = await OrderService.updateOrder(id, message, address, status, newOrderItems, totalPrice);

    res.status(200).json({
      message: '주문 정보가 변경되었습니다.',
      updatedOrder,
    });
  } catch (err) {
    next(err);
  }
});

orderRouter.patch('/update/status', authenticateAdmin, async (req, res, next) => {
  const { orderIds, status } = req.body;

  try {
    const updatedOrder = await OrderService.updateStatuses(orderIds, status);

    res.status(201).json({
      message: '주문 정보가 변경되었습니다.',
      updatedOrder,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/orders/:id/delete
orderRouter.delete('/delete', authenticateUser, validateOnShipping('body'), async (req, res, next) => {
  const { orderIds } = req.body;

  try {
    await OrderService.deleteOrders(orderIds);

    res.status(200).json({ message: '주문이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = orderRouter;
