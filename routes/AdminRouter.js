const express = require('express');
const AdminService = require('../services/adminService');
const { authenticateAdmin } = require('../middlewares/authUserMiddlewares');

const router = express.Router();

// 관리자 권한
router.use(authenticateAdmin);

// 전체 회원 목록 조회 (pagination: default 20개)
router.get('/users', async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const users = await AdminService.getAllUsers(page);
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
});

// 회원에게 관리자 권한 부여
router.put('/users/:id/grant-admin', async (req, res, next) => {
  try {
    const userIdToGrantAdmin = req.params.id;
    const grantedUser = await AdminService.grantAdmin(userIdToGrantAdmin);
    res.status(200).json({ message: '관리자 권한이 부여되었습니다.', user: grantedUser });
  } catch (err) {
    next(err);
  }
});

// 관리자에게 회원 권한 부여
router.put('/users/:id/revoke-admin', async (req, res, next) => {
  try {
    const userIdToRevokeAdmin = req.params.id;
    const revokedUser = await AdminService.revokeAdmin(userIdToRevokeAdmin);
    res.status(200).json({ message: '회원 권한이 부여되었습니다.', user: revokedUser });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
