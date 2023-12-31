const express = require('express');
const UserService = require('../services/userService');
const { authenticateUser } = require('../middlewares/authUserMiddlewares');
const { checkLoginStatus } = require('../middlewares/authUserMiddlewares');

const router = express.Router();

// 회원가입(이메일 인증코드 발송)
router.post('/register/send-mail', async (req, res, next) => {
  try {
    const { email } = req.body;
    await UserService.sendEmailVerificationCode(email);
    res.status(200).json({ message: '인증번호가 이메일로 전송되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// 회원가입(이메일 인증코드 확인)
router.post('/register/verify-email-code', async (req, res, next) => {
  try {
    const { email, code } = req.body;
    await UserService.verifyEmailCode(email, code);
    res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// 회원가입
router.post('/register', async (req, res, next) => {
  try {
    const { name, phonenumber, email, password } = req.body;
    const user = await UserService.register({ name, phonenumber, email, password });
    res.status(201).json({ message: '회원가입이 완료되었습니다.', user });
  } catch (err) {
    next(err);
  }
});

// 로그인
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, refreshToken, user } = await UserService.login({ email, password });
    // 액세스 토큰, 리프레시 토큰을 쿠키에 저장
    res.cookie('token', token, { httpOnly: true }); // 쿠키에 접근할 수 없게 함
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.status(200).json({ message: '로그인 되었습니다.', user });
  } catch (err) {
    next(err);
  }
});

// 로그아웃
router.post('/logout', async (req, res, next) => {
  try {
    res.clearCookie('token'); // 쿠키 삭제
    res.clearCookie('refreshToken');
    res.status(200).json({ message: '로그아웃 되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// 로그인 상태 확인
router.get('/check-login', checkLoginStatus, async (req, res, next) => {
  try {
    if (req.user) {
      res.status(200).json({ isLoggedIn: true, user: req.user });
    } else {
      res.status(200).json({ isLoggedIn: false });
    }
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
    const { password, updatedData } = req.body;
    const user = await UserService.updateUser(userId, password, updatedData);
    res.status(200).json({ message: '회원 정보가 수정되었습니다.', user });
  } catch (err) {
    next(err);
  }
});

// 회원 정보 삭제(탈퇴)
router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;
    await UserService.deleteUser(userId, password);
    res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
