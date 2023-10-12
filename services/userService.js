const { User } = require('../models/User');
const { NotFoundError } = require('../common/NotFoundError');
const { BadRequestError } = require('../common/BadRequestError');
const { sendMail } = require('../utils/sendMail');

class UserService {
  emailVerificationCodes = {};

  // 회원가입
  async register({ name, phonenumber, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('이미 가입된 이메일입니다.');
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

  // 이메일 인증코드 발송
  async sendEmailVerificationCode(email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('이미 가입된 이메일입니다.');
    }

    // 이메일 인증번호 생성
    const emailVerificationCode = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    // 이메일 인증 코드 저장
    this.emailVerificationCodes[email] = emailVerificationCode;

    // 이메일 전송
    await sendMail(email, '[RE: BIRTH] 회원가입 이메일 인증 메일입니다.', `이메일 인증 코드: ${emailVerificationCode}`);

    return emailVerificationCode;
  }

  // 이메일 인증코드 확인
  async verifyEmailCode(email, inputCode) {
    const savedCode = this.emailVerificationCodes[email];

    if (!savedCode || inputCode !== savedCode) {
      throw new BadRequestError('이메일 인증 코드가 일치하지 않습니다.');
    }

    return true;
  }

  // 로그인
  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    await user.comparePassword(password);

    // 액세스 토큰, 리프레시 토큰 생성
    const token = await user.generateToken();
    const refreshToken = await user.generateRefreshToken();

    return { token, refreshToken, user };
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
  async updateUser(userId, password, updatedData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    await user.comparePassword(password);

    // 업데이트할 정보 적용
    Object.assign(user, updatedData);
    await user.save();

    return user;
  }

  // 회원정보 삭제(탈퇴)
  async deleteUser(userId, password) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    await user.comparePassword(password);

    await user.deleteOne({ _id: userId });

    return user;
  }
}

module.exports = new UserService();
