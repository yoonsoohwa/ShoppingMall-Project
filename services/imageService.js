const { Image } = require('../models/Image');

class ImageService {
  // eslint-disable-next-line class-methods-use-this
  async createImage({ imageType, url }) {
    const image = await Image.create({
      imageType,
      url,
    });

    return image;
  }
}

module.exports = new ImageService();
