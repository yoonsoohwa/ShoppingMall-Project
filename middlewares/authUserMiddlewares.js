const { ForbiddenError } = require('../common/ForbiddenError');
const { UnauthorizedError } = require('../common/UnauthorizedError');
const { User } = require('../models/User');

// 요청의 헤더에서 토큰 추출하는 함수(payload 데이터)
function extractToken(req) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startWith('Bearer')) {
    return null;
  }
  return authorizationHeader.split(' ')[1];
}

// 사용자 인증 미들웨어
const authenticateUser = async (req, res, next) => {
  try {
    // 헤더에서 payload 데이터가 담긴 토큰 추출
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError('로그인한 유저만 사용할 수 있는 서비스입니다.');
    }
    // 토큰 검증
    const user = await User.findByToken(token);
    if (!user) {
      throw new UnauthorizedError('인증되지 않은 사용자입니다.');
    }
    // 요청 객체에 사용자 정보 추가
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// 관리자 인증 미들웨어
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new ForbiddenError('관리자 권한이 필요합니다.');
    }
    const user = await User.findByToken(token);
    if (!user) {
      throw new UnauthorizedError('인증되지 않은 사용자입니다.');
    }
    // 관리자 검증
    if (user.roll !== 'admin') {
      throw new ForbiddenError('관리자 권한이 필요합니다.', 403);
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticateUser, authenticateAdmin };
