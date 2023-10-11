/* eslint-disable class-methods-use-this */
const { NotFoundError } = require('../common/NotFoundError');
const Category = require('../models/Category');
const Item = require('../models/Item');

class CategoryService {
  async getProductsInCategory(categoryId) {
    // categoryId를 사용하여 해당 카테고리에 속한 상품들을 검색하는 로직을 구현
    // 예를 들어, Item 모델에서 해당 카테고리의 상품을 검색하여 반환
    const products = await Item.find({ category: categoryId }).exec();
    return products;
  }

  async createCategory(name) {
    const newCategory = await Category.create({ name }); // 모델 필드 이름 수정
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

  async getProductsPagination(id, page, limit) {
    const skip = (page - 1) * limit;
    const totalProducts = await Item.countDocuments({ category: id });
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Item.find({ category: id }).skip(skip).limit(limit);
    return { items: products, totalPages };
  }
}

module.exports = new CategoryService();
