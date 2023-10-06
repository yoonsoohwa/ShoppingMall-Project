const express = require("express");
const userService = require("../services/userService");
const { authenticateUser } = require("../middlewares/authUserMiddlewares");

const router = express.Router();

// 회원가입
router.post("/register", async (req, res, next) => {
  try {
    const user = await userService.register(req, res, next);
    res.status(201).json({ message: "회원가입이 완료되었습니다.", user });
  } catch (err) {
    next(err);
  }
});

// 사용자 로그인
router.post("/login", async (req, res, next) => {
  try {
    const token = await userService.login(req, res, next);
    res.status(200).json({ message: "로그인 성공", token });
  } catch (err) {
    next(err);
  }
});

// 회원 정보 조회
router.get("/", authenticateUser, async (req, res, next) => {
  try {
    // 인증된 사용자 id 사용
    const userId = req.user._id;
    const user = await userService.getUserById(userId);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

// 회원 정보 수정
router.put("/", authenticateUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updatedData = req.body;
    const user = await userService.updateUser(userId, updatedData);
    res.status(200).json({ message: "회원 정보가 수정되었습니다.", user });
  } catch (err) {
    next(err);
  }
});

// 회원 정보 삭제
router.delete("/", authenticateUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    await userService.deleteUser(userId);
    res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
