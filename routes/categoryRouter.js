// routes/categoryRouter.js

const { Router } = require('express');
const categoryService = require('../services/categoryService');

const categoryRouter = Router();

// GET /api/v1/categories/:id/items - 특정 카테고리의 상품들 불러오기 (id:category 값)
categoryRouter.get('/:id/items', async (req, res, next) => {
  const { id } = req.params;

  try {
    const productsInCategory = await categoryService.getProductsInCategory(id);
    res.status(200).json(productsInCategory);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/categories - 모든 카테고리 불러오기
categoryRouter.get('/', async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/categories
categoryRouter.post('/', async (req, res, next) => {
  const { name } = req.body; // "name" 필드 추출

  try {
    const newCategory = await categoryService.createCategory(name);
    res.status(201).json({
      message: '카테고리가 성공적으로 추가되었습니다.',
      category: newCategory,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/categories/:id - 카테고리 수정
categoryRouter.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await categoryService.updateCategory(id, name);
    res.status(200).json({
      message: '카테고리가 성공적으로 수정되었습니다.',
      category: updatedCategory,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/categories/:id - 카테고리 삭제
categoryRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedCategory = await categoryService.deleteCategory(id);
    res.status(200).json({
      message: '카테고리가 성공적으로 삭제되었습니다.',
      category: deletedCategory,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/categories/:id/items/:page/:limit - 특정 카테고리의 상품들 불러오기 (id:category 값)
categoryRouter.get('/:id/items/:page/:limit', async (req, res, next) => {
  const { id, page = 1, limit = 20 } = req.params;
  try {
    const productsInCategory = await categoryService.getProductsPagination(id, page, limit);
    res.status(200).json({
      message: '페이지별 카테고리 아이템 조회가 성공적으로 이뤄졌습니다.',
      items: productsInCategory.items, // 해당 카테고리의 아이템 목록을 반환
      currentPage: page,
      totalPages: productsInCategory.totalPages,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = categoryRouter;
