const express = require('express');
const UserService = require('../services/userService');
const { authenticateUser } = require('../middlewares/authUserMiddlewares');

const router = express.Router();

// 회원가입(이메일 인증)
router.post('/register/send-mail', async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailVerificationCode = await UserService.sendEmailVerificationCode(email);
    res.status(200).json({ message: '인증번호가 이메일로 전송되었습니다.', emailVerificationCode });
  } catch (err) {
    next(err);
  }
});

// 회원가입
router.post('/register', async (req, res, next) => {
  try {
    const { name, phonenumber, email, password, confirmPassword } = req.body;
    const user = await UserService.register({ name, phonenumber, email, password, confirmPassword });
    res.status(201).json({ message: '회원가입이 완료되었습니다.', user });
  } catch (err) {
    next(err);
  }
});

// 사용자 로그인
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await UserService.login({ email, password });
    res.status(200).json({ message: '로그인 성공', token });
  } catch (err) {
    next(err);
  }
});

// 토큰 갱신
router.post('/refresh-token', authenticateUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const refreshToken = await UserService.refreshToken(userId);
    res.status(200).json({ accessToken: refreshToken });
  } catch (err) {
    next(err);
  }
});

// 회원 정보 조회
router.get('/:id', authenticateUser, async (req, res, next) => {
  try {
    // 인증된 사용자 id 사용
    const userId = req.user._id;
    const user = await UserService.getUserById(userId);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

// 회원 정보 수정
router.put('/:id', authenticateUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { oldPassword, confirmPassword, updatedData } = req.body;
    const user = await UserService.updateUser(userId, oldPassword, confirmPassword, updatedData);
    res.status(200).json({ message: '회원 정보가 수정되었습니다.', user });
  } catch (err) {
    next(err);
  }
});

// 회원 정보 삭제(탈퇴)
router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    await UserService.deleteUser(userId);
    res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
