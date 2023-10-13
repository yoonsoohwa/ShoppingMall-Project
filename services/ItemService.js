const Item = require('../models/Item');
const { NotFoundError } = require('../common/NotFoundError');

class ItemService {
  async getItems() {
    const items = await Item.find();
    return items;
  }

  async getItemById(id) {
    const item = await Item.findById(id);
    return item;
  }

  async addItem(category, name, price, option, content, image, detailImages) {
    const newItem = new Item({ category, name, price, option, content });

    const thumbnail = { imageType: 'thumbnail', url: image.location };
    const details = detailImages.map((detail) => ({ imageType: 'detail', url: detail.location }));

    newItem.image = thumbnail;
    newItem.detail_image = details;

    await newItem.save();

    return newItem;
  }

  async deleteItem(itemId) {
    const deletedItem = await Item.findByIdAndRemove(itemId);
    if (!deletedItem) {
      throw new NotFoundError('해당 아이템을 찾을 수 없습니다.');
    }
    return deletedItem;
  }

  async deleteItems(itemIds) {
    const deletedItem = await Item.deleteMany({ _id: itemIds });
    if (!deletedItem) {
      throw new NotFoundError('해당 아이템을 찾을 수 없습니다.');
    }
    return deletedItem;
  }

  async updateItem(itemId, updatedItemData) {
    const updatedItem = await Item.findByIdAndUpdate(itemId, updatedItemData, {
      new: true,
    });
    if (!updatedItem) {
      throw new NotFoundError('해당 아이템을 찾을 수 없습니다.');
    }
    return updatedItem;
  }

  async getItemsByPage(page, limit) {
    const skip = (page - 1) * limit;
    const totalItems = await Item.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const items = await Item.find().skip(skip).limit(limit);
    return { items, totalPages };
  }

  async getitemsByCategory(category, page, limit) {
    const skip = (page - 1) * limit;
    const totalItems = await Item.countDocuments({ category });
    const totalPages = Math.ceil(totalItems / limit);
    const items = await Item.find({ category }).skip(skip).limit(limit);
    return { items, totalPages };
  }
}

module.exports = new ItemService();
