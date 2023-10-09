const { Router } = require('express');
const { Item } = require('../models/Item');

const itemsRouter = Router();
// Item , Category , Admin(등록, 수정, 삭제)

// -----------사용자------------//
// GET //
// Item 클릭
// Category 별 클릭

// POST //
// 관리자 - 제품 추가, 삭제, 수정

// GET /api/v1/items
itemsRouter.get('/', async (req, res, next) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/items/:category
itemsRouter.get('/:category', async (req, res, next) => {
  const { category } = req.params;
  try {
    const itemsInCategory = await Item.find({ category });
    res.status(200).json(itemsInCategory);
  } catch (err) {
    next(err);
  }
});

// -----------관리자----------------//
// Post
// delete
// update

// 상품 추가, POST /api/v1/items
itemsRouter.post('/', async (req, res, next) => {
  const newItem = new Item(req.body);
  try {
    await newItem.save();
    res.status(201).json({ message: '아이템이 성공적으로 추가되었습니다.', item: newItem });
  } catch (err) {
    next(err);
  }
});

// 상품 삭제,DELETE /api/v1/items/:id
itemsRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedItem = await Item.findByIdAndRemove(id);
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
    const updatedItem = await Item.findByIdAndUpdate(id, updatedItemData, {
      new: true,
    });
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
  // URL 페이지 번호, items 수 검색(?)
  const { page = 1, limit = 20 } = req.params;
  // skip : 검색 시 건너뛸 항목 수! (인덱스 값 0, -1 해줘야됨)
  try {
    const skip = (page - 1) * limit;
    const items = await Item.find().skip(skip).limit(limit);

    const totalItems = await Item.countDocuments();
    // 페이지 수 계산
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      message: '페이지별 아이템 조회가 성공적으로 이뤄졌습니다.',
      items,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = itemsRouter;
