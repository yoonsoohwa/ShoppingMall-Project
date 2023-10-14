const Item = require('../models/Item');
const { BadRequestError } = require('../common/BadRequestError');

const validateItem = async (req, res, next) => {
  const { id } = req.params;

  const item = await Item.findById(id);
  if (!item) {
    next(new BadRequestError('해당 상품이 존재하지 않습니다.'));
    return;
  }

  next();
};

const validateImage = (req, res, next) => {
  const image = req.files.image[0];

  if (!image) {
    next(new BadRequestError('이미지가 존재하지 않습니다.'));
    return;
  }

  next();
};

module.exports = {
  validateItem,
  validateImage,
};
