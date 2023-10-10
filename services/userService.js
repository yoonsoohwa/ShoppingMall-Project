const { User } = require('../models/User');
const { NotFoundError } = require('../common/NotFoundError');
const { BadRequestError } = require('../common/BadRequestError');
const { sendMail } = require('../utils/sendMail');

class UserService {
  // 회원가입
  async register({ name, phonenumber, email, password, confirmPassword }) {
    if (!name || !phonenumber || !email || !password || !confirmPassword) {
      throw new BadRequestError('모든 필수 입력란을 채워주세요.');
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new BadRequestError('이메일 형식이 올바르지 않습니다.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('이미 가입된 이메일입니다.');
    }

    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phonenumber)) {
      throw new BadRequestError('휴대폰 번호 형식이 올바르지 않습니다. (예: 123-4567-8901)');
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/.test(password)) {
      throw new BadRequestError('비밀번호는 최소 8자, 하나의 문자, 하나의 숫자, 하나의 특수 문자를 포함해야 합니다.');
    }

    if (password !== confirmPassword) {
      throw new BadRequestError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }

    const user = new User({
      name,
      phonenumber,
      email,
      password,
      role: 'user',
    });

    await user.save();

    return user;
  }

  // 이메일 인증
  async sendEmailVerificationCode(email) {
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new BadRequestError('이메일 형식이 올바르지 않습니다.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('이미 가입된 이메일입니다.');
    }

    // 이메일 인증번호 생성
    const emailVerificationCode = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    // 이메일 전송
    await sendMail(email, '[RE: BIRTH] 회원가입 이메일 인증 메일입니다.', `이메일 인증 코드: ${emailVerificationCode}`);

    return emailVerificationCode;
  }

  // 로그인
  async login({ email, password }) {
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new BadRequestError('이메일 형식이 올바르지 않습니다.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    await user.comparePassword(password);

    // 액세스 토큰, 리프레시 토큰 생성
    const token = await user.generateToken();
    const refreshToken = await user.generateRefreshToken();

    return { token, refreshToken };
  }

  // 회원정보 조회
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  // 회원정보 수정
  async updateUser(userId, oldPassword, confirmPassword, updatedData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    if (updatedData.email && updatedData.email !== user.email) {
      throw new BadRequestError('이메일은 수정할 수 없습니다.');
    }

    if (!oldPassword || !confirmPassword) {
      throw new BadRequestError('기존의 비밀번호와 비밀번호 확인을 입력하세요.');
    }

    if (oldPassword !== confirmPassword) {
      throw new BadRequestError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    } else {
      await user.comparePassword(oldPassword);
    }

    if (updatedData.password) {
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/.test(updatedData.password)) {
        throw new BadRequestError('비밀번호는 최소 8자, 하나의 문자, 하나의 숫자, 하나의 특수 문자를 포함해야 합니다.');
      }
    }

    if (updatedData.phonenumber) {
      if (!/^\d{3}-\d{3,4}-\d{4}$/.test(updatedData.phonenumber)) {
        throw new BadRequestError('휴대폰 번호 형식이 올바르지 않습니다. (예: 123-4567-8901)');
      }
    }

    // 업데이트할 정보 적용
    Object.assign(user, updatedData);
    await user.save();

    return user;
  }

  // 회원정보 삭제(탈퇴)
  async deleteUser(userId, password, confirmPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    if (!password || !confirmPassword) {
      throw new BadRequestError('비밀번호와 비밀번호 확인을 입력하세요.');
    }

    if (password !== confirmPassword) {
      throw new BadRequestError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    } else {
      await user.comparePassword(password);
    }

    await user.deleteOne({ _id: userId });

    return user;
  }
}

module.exports = new UserService();
