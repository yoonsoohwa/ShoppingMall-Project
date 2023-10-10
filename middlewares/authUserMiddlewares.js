const { ForbiddenError } = require('../common/ForbiddenError');
const { UnauthorizedError } = require('../common/UnauthorizedError');
const { User } = require('../models/User');

// 사용자 인증 미들웨어
const authenticateUser = async (req, res, next) => {
  try {
    // 헤더에서 액세스 토큰 추출
    const accessToken = req.cookies.token;
    if (!accessToken) {
      throw new ForbiddenError('로그인한 유저만 사용할 수 있는 서비스입니다.');
    }
    // 액세스 토큰 검증
    const { foundUser, error } = await User.findByToken(accessToken);
    if (error) {
      // 액세스 토큰이 만료된 경우 리프레시 토큰 검증(유효하다면 액세스 토큰 재발급)
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new UnauthorizedError('인증되지 않은 사용자입니다.');
      }
      let refreshUser; // 예외처리
      let refreshError;
      try {
        const result = await User.findByToken(refreshToken);
        refreshUser = result.foundUser;
        refreshError = result.error;
      } catch (err) {
        refreshError = err;
      }
      if (refreshError) {
        throw new ForbiddenError('새로 로그인해야 합니다.');
      }
      // 새로운 액세스 토큰 생성 후 쿠키에 저장
      const newAccessToken = await refreshUser.generateToken();
      res.cookie('token', newAccessToken, { httpOnly: true });
      req.user = refreshUser;
    } else {
      // 액세스 토큰이 유효한 경우 사용자 정보 추가
      req.user = foundUser;
    }
    next();
  } catch (err) {
    next(err);
  }
};

// 관리자 인증 미들웨어
const authenticateAdmin = async (req, res, next) => {
  try {
    // 헤더에서 액세스 토큰 추출
    const accessToken = req.cookies.token;
    if (!accessToken) {
      throw new ForbiddenError('로그인한 유저만 사용할 수 있는 서비스입니다.');
    }
    // 액세스 토큰 검증
    const { foundUser, error } = await User.findByToken(accessToken);
    if (error) {
      // 액세스 토큰이 만료된 경우 리프레시 토큰 검증(유효하다면 액세스 토큰 재발급)
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new UnauthorizedError('인증되지 않은 사용자입니다.');
      }
      let refreshUser; // 예외처리
      let refreshError;
      try {
        const result = await User.findByToken(refreshToken);
        refreshUser = result.foundUser;
        refreshError = result.error;
      } catch (err) {
        refreshError = err;
      }
      if (refreshError) {
        throw new ForbiddenError('새로 로그인해야 합니다.');
      }
      // 새로운 액세스 토큰 생성 후 쿠키에 저장
      const newAccessToken = await refreshUser.generateToken();
      res.cookie('token', newAccessToken, { httpOnly: true });
      req.user = refreshUser;
    } else {
      // 액세스 토큰이 유효한 경우 사용자 정보 추가
      req.user = foundUser;
    }
    // 관리자 검증
    if (foundUser.role !== 'admin') {
      throw new ForbiddenError('관리자 권한이 필요합니다.');
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticateUser, authenticateAdmin };
