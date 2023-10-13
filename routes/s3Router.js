const { Router } = require('express');
const { upload } = require('../services/s3Service');
const { BadRequestError } = require('../common/BadRequestError');

const s3Router = Router();

s3Router.post('/thumbnail', upload.single('image'), async (req, res, next) => {
  try {
    const image = req.file.location;
    if (!image) {
      throw new BadRequestError('이미지가 존재하지 않습니다.');
    }
    res.status(201).json({ message: '이미지가 저장되었습니다.', image });
  } catch (err) {
    next(err);
  }
});

s3Router.post('/details', upload.array('image', 4), async (req, res, next) => {
  try {
    const image = req.files;
    const path = image.map((img) => img.location);
    if (!image) {
      throw new BadRequestError('이미지가 존재하지 않습니다.');
    }
    res.status(201).json({ message: '이미지가 저장되었습니다.', path });
  } catch (err) {
    next(err);
  }
});

module.exports = s3Router;
