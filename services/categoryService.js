// services/categoryService.js

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

  async createCategories(names) {
    const newCategories = await Category.create(names.map((name) => ({ names: [name] })));
    return newCategories;
  }

  async getAllCategories() {
    // 모든 카테고리 생성 및 반환 , 파라미터 x
    const categories = await Category.find();
    return categories;
  }

  async updateCategory(id, names) {
    // 카테고리 업데이트 , id로 name 업데이트(?)
    const updatedCategory = await Category.findByIdAndUpdate(id, { names }, { new: true });

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
}

module.exports = new CategoryService();
