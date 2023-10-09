const { NotFoundError } = require('../common/NotFoundError');
const { Category } = require('../models/Category');

class CategoryService {
  // eslint-disable-next-line class-methods-use-this
  async createCategory(name) {
    const newCategory = await Category.create({ name });
    return newCategory;
  }

  // eslint-disable-next-line class-methods-use-this
  async getAllCategories() {
    const categories = await Category.find();
    return categories;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateCategory(id, name) {
    const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedCategory) {
      throw new NotFoundError('해당 카테고리를 찾을 수 없습니다.');
    }

    return updatedCategory;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteCategory(id) {
    const deletedCategory = await Category.findByIdAndRemove(id);

    if (!deletedCategory) {
      throw new NotFoundError('해당 카테고리를 찾을 수 없습니다.');
    }

    return deletedCategory;
  }
}

module.exports = new CategoryService();
