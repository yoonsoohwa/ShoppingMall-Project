/* eslint-disable class-methods-use-this */
const { NotFoundError } = require('../common/NotFoundError');
const { Category } = require('../models/Category');

class CategoryService {
  async createCategory(name) {
    // 카테고리 생성 및 반환 , name
    const newCategory = await Category.create({ name });
    return newCategory;
  }

  async getAllCategories() {
    // 모든 카테고리 생성 및 반환 , 파라미터 x
    const categories = await Category.find();
    return categories;
  }

  async updateCategory(id, name) {
    // 카테고리 업데이트 , id로 name 업데이트(?)
    const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedCategory) {
      throw new NotFoundError('해당 카테고리를 찾을 수 없습니다.');
    }

    return updatedCategory;
  }

  async deleteCategory(id) {
    // 카테고리 삭제 , id 값을 전달 받음
    const deletedCategory = await Category.findByIdAndRemove(id);

    if (!deletedCategory) {
      throw new NotFoundError('해당 카테고리를 찾을 수 없습니다.');
    }

    return deletedCategory;
  }

  async getPagination({ page, limit }) {
    const skip = (page - 1) * limit;
    const categories = await Category.find().skip(skip).limit(limit);

    const count = await Category.countDocuments();

    return { categories, count };
  }
}

module.exports = new CategoryService();
