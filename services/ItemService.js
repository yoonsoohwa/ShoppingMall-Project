const Item = require('../models/Item');
const { NotFoundError } = require('../common/NotFoundError');

class ItemService {
  async getItems() {
    const items = await Item.find();
    return items;
  }

  async getItemById(id) {
    const item = await Item.findById(id).exec();
    return item;
  }

  async getItemsByCategory(category) {
    const itemsInCategory = await Item.find({ category });
    return itemsInCategory;
  }

  async addItem(itemData) {
    const newItem = new Item(itemData);
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

  async updateItem(itemId, updatedItemData) {
    const updatedItem = await Item.findByIdAndUpdate(itemId, updatedItemData, {
      new: true,
    });
    if (!updatedItem) {
      throw new NotFoundError('해당 아이템을 찾을 수 없습니다.');
    }
    return updatedItem;
  }

  async getItemsByPage(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const items = await Item.find().skip(skip).limit(limit);
    const totalItems = await Item.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      items,
      totalPages,
    };
  }
}

module.exports = new ItemService();
