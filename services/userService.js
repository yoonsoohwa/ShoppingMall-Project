const AppError = require("../common/AppError");
const commonErrors = require("../common/commonErrors");
const { User } = require("../models/User");
const { Credential } = require("../models/Credential");

// 회원가입 처리
async function register(req, res, next) {
  try {
    const { name, phoneNumber, email, password, roll } = req.body;
    // 이메일 형식 확인
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      const error = new AppError(
        commonErrors.requestValidationError,
        "이메일 형식이 올바르지 않습니다.",
        400
      );
      return next(error);
    }
    // 이메일 중복 확인
    const existingUser = await User.findOne({ "credential.email": email });
    if (existingUser) {
      const error = new AppError(
        commonErrors.requestValidationError,
        "해당 이메일은 이미 사용 중입니다.",
        400
      );
      return next(error);
    }
    // 휴대폰 형식 확인
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phoneNumber)) {
      const error = new AppError(
        commonErrors.requestValidationError,
        "휴대폰 번호 형식이 올바르지 않습니다. (예: 123-4567-8901)",
        400
      );
      return next(error);
    }
    const credential = new Credential({
      phoneNumber,
      email,
    });
    const user = new User({
      name,
      password,
      roll,
      credential: credential._id,
    });
    // 비밀번호 해싱
    await user.save();
    return user;
  } catch (err) {
    if (err.name === "ValidationError") {
      // 비밀번호 유효성 검사 실패 시, 간단한 오류 메시지로 변환
      const errorMessages = Object.values(err.errors).map((e) => e.message);
      const error = new AppError(
        commonErrors.requestValidationError,
        errorMessages.join(" "),
        400
      );
      return next(error);
    }
    return next(err);
  }
}

// 로그인 처리
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    // 이메일로 사용자 찾기
    const user = await User.findOne({ "credential.email": email });
    if (!user) {
      const error = new AppError(
        commonErrors.requestValidationError,
        "사용자를 찾을 수 없습니다.",
        404
      );
      return next(error);
    }
    // 비밀번호 확인
    await user.comparePassword(password);
    // JWT 토큰 생성(id와 roll 정보 담겨 있음)
    const token = await user.generateToken();
    return token;
  } catch (err) {
    return next(err);
  }
}

// 회원 정보 조회
async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(
      commonErrors.requestValidationError,
      "사용자를 찾을 수 없습니다.",
      404
    );
  }
  return user;
}

// 회원 정보 수정
async function updateUser(userId, updatedData) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(
      commonErrors.requestValidationError,
      "사용자를 찾을 수 없습니다.",
      404
    );
  }
  // 업데이트할 정보 적용
  Object.assign(user, updatedData);
  await user.save();
  return user;
}

// 회원 정보 삭제(탈퇴)
async function deleteUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(
      commonErrors.requestValidationError,
      "사용자를 찾을 수 없습니다.",
      404
    );
  }
  await user.remove();
  return user;
}

module.exports = { register, login, getUserById, updateUser, deleteUser };
