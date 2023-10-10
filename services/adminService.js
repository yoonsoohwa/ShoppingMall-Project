const { User } = require('../models/User');
const { NotFoundError } = require('../common/NotFoundError');
const { BadRequestError } = require('../common/BadRequestError');

class AdminService {
  // 전체 회원 목록 조회 (pagination: default 20개)
  async getAllUsers(page) {
    const limit = 20; // 한 페이지에 표시할 개수
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    if (!users) {
      throw new NotFoundError('전체 회원 목록을 조회할 수 없습니다.');
    }

    return users;
  }

  // 회원에게 관리자 권한 부여
  async grantAdmin(userIdToGrantAdmin) {
    const user = await User.findById(userIdToGrantAdmin);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    if (user.role === 'admin') {
      throw new BadRequestError('이미 관리자 권한이 부여된 사용자입니다.');
    }

    user.role = 'admin';
    await user.save();

    return user;
  }

  // 관리자에게 회원 권한 부여
  async revokeAdmin(userIdToRevokeAdmin) {
    const user = await User.findById(userIdToRevokeAdmin);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    if (user.role !== 'admin') {
      throw new BadRequestError('이미 회원 권한을 가진 사용자입니다.');
    }

    user.role = 'user';
    await user.save();

    return user;
  }
}

module.exports = new AdminService();
