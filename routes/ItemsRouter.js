const { Router } = require('express');
const itemService = require('../services/ItemService');

const itemsRouter = Router();

// GET /api/v1/items
itemsRouter.get('/', async (req, res, next) => {
  try {
    const items = await itemService.getItems(); // 변경

    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/items/:category
itemsRouter.get('/:category', async (req, res, next) => {
  const { category } = req.params;
  try {
    const itemsInCategory = await itemService.getItemsByCategory(category); // 변경
    res.status(200).json(itemsInCategory);
  } catch (err) {
    next(err);
  }
});

// 상품 추가, POST /api/v1/items
itemsRouter.post('/', async (req, res, next) => {
  try {
    const newItem = await itemService.addItem(req.body); // 변경
    res.status(201).json({ message: '아이템이 성공적으로 추가되었습니다.', item: newItem });
  } catch (err) {
    next(err);
  }
});

// 상품 삭제, DELETE /api/v1/items/:id
itemsRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedItem = await itemService.deleteItem(id); // 변경
    if (!deletedItem) {
      res.status(404).json({ message: '해당 아이템을 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '아이템이 삭제되었습니다.', item: deletedItem });
  } catch (err) {
    next(err);
  }
});

// 상품 수정, PUT /api/v1/items/:id
itemsRouter.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const updatedItemData = req.body;
  try {
    const updatedItem = await itemService.updateItem(id, updatedItemData); // 변경
    if (!updatedItem) {
      res.status(404).json({ message: '해당 아이템을 찾을 수 없습니다.' });
    }
    res.status(200).json({
      message: '아이템이 성공적으로 수정되었습니다.',
      item: updatedItem,
    });
  } catch (err) {
    next(err);
  }
});

// pagination : default : 20 items
// GET /api/v1/items/page/:page/:limit
itemsRouter.get('/page/:page/:limit', async (req, res, next) => {
  const { page = 1, limit = 20 } = req.params;
  try {
    const items = await itemService.getItemsByPage(page, limit); // 변경

    res.status(200).json({
      message: '페이지별 아이템 조회가 성공적으로 이뤄졌습니다.',
      items: items.items,
      currentPage: page,
      totalPages: items.totalPages,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = itemsRouter;
