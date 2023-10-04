const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

const userSchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 50,
      required: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/.test(
            value
          );
        },
        message:
          "비밀번호는 최소 8자, 하나의 문자, 하나의 숫자, 하나의 특수 문자를 포함해야 합니다.",
      },
    },
    roll: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    credential: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Credential",
    },
    token: {
      // 인증서 역할
      type: String,
    },
    tokenExp: {
      // 토큰 만료일
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// 비밀번호 해싱 미들웨어 - 모델 저장되기 전 비밀번호가 자동으로 해싱
userSchema.pre("save", async function preSave(next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

// 비밀번호 비교 메서드(로그인 시 사용)
userSchema.methods.comparePassword = async function comparePassword(
  plainPassword
) {
  const isMatch = await bcrypt.compare(plainPassword, this.password);
  if (!isMatch) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }
  return isMatch;
};

// 사용자 인스턴스에 대한 JWT 토큰을 생성하고 저장하는 메서드(로그인 시 사용)
userSchema.methods.generateToken = async function generateToken() {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), process.env.SECRET_KEY); // jwt 토큰 생성
  const oneHour = moment().add(1, "hour").valueOf();
  // user.tokenExp, user.token 속성 업데이트한 뒤 사용자 저장
  user.tokenExp = oneHour;
  user.token = token;
  await user.save();
  return token;
};

// JWT 토큰 사용하여 사용자 검색(사용자 인증 미들웨어에 사용)
userSchema.statics.findByToken = async function findByToken(token) {
  const user = this;
  const decode = jwt.verify(token, process.env.SECRET_KEY); // 토큰 검증
  const foundUser = await user.findOne({ _id: decode, token }); // 토큰 유효한 경우 사용자 찾기
  if (!foundUser) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }
  return foundUser;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
