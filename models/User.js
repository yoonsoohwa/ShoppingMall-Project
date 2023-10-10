const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../common/BadRequestError');
const { NotFoundError } = require('../common/NotFoundError');

const userSchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 50,
      required: true,
    },
    phonenumber: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// 비밀번호 해싱 미들웨어 - 모델 저장되기 전 비밀번호가 자동으로 해싱
userSchema.pre('save', async function preSave(next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

// 비밀번호 비교 메서드(로그인 시 사용)
userSchema.methods.comparePassword = async function comparePassword(plainPassword) {
  const isMatch = await bcrypt.compare(plainPassword, this.password);
  if (!isMatch) {
    throw new BadRequestError('비밀번호가 일치하지 않습니다.');
  }
  return isMatch;
};

// 액세스 토큰 생성 메서드(로그인 시 사용)
userSchema.methods.generateToken = async function generateToken() {
  const user = this;
  const payload = {
    _id: user._id.toHexString(),
    role: user.role,
  };
  // 액세스 토큰 생성
  const token = await jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '1h', // 액세스 토큰 만료 시간 (1시간)
  });
  return token;
};

// 리프레시 토큰 생성 메서드(로그인 시  사용)
userSchema.methods.generateRefreshToken = async function generateRefreshToken() {
  const user = this;
  const payload = {
    _id: user._id.toHexString(),
    role: user.role,
  };
  // 리프레시 토큰 생성
  const refreshToken = await jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '7d', // 리프레시 토큰 만료 시간 (7일)
  });
  return refreshToken;
};

// JWT 토큰 사용하여 사용자 검색(사용자 인증 미들웨어에 사용)
userSchema.statics.findByToken = async function findByToken(token) {
  const user = this;
  try {
    const decode = await jwt.verify(token, process.env.SECRET_KEY); // 토큰 검증
    const foundUser = await user.findOne({ _id: decode._id });
    if (!foundUser) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }
    return { foundUser, error: null };
  } catch (err) {
    const error = err;
    return { foundUser: null, error };
  }
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
