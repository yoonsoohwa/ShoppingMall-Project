const { Router } = require("express");
const { Item } = require("../models/Item");

const itemsRouter = Router();
// Item , Category , Admin(등록, 수정, 삭제)

// -----------사용자------------//
// GET //
// Item 클릭
// Category 별 클릭

// POST //
// 관리자 - 제품 추가, 삭제, 수정

// GET /api/v1/items
itemsRouter.get("/", async (req, res, next) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/items/:category
itemsRouter.get("/:category", async (req, res, next) => {
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
itemsRouter.post("/", async (req, res, next) => {
  const newItem = new Item(req.body);
  try {
    await newItem.save();
    res
      .status(201)
      .json({ message: "아이템이 성공적으로 추가되었습니다.", item: newItem });
  } catch (err) {
    next(err);
  }
});

// 상품 삭제,DELETE /api/v1/items/:id
itemsRouter.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedItem = await Item.findByIdAndRemove(id);
    if (!deletedItem) {
      res.status(404).json({ message: "해당 아이템을 찾을 수 없습니다." });
    }
    res
      .status(200)
      .json({ message: "아이템이 삭제되었습니다.", item: deletedItem });
  } catch (err) {
    next(err);
  }
});

// 상품 수정, PUT /api/v1/items/:id
itemsRouter.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const updatedItemData = req.body;
  try {
    const updatedItem = await Item.findByIdAndUpdate(id, updatedItemData, {
      new: true,
    });
    if (!updatedItem) {
      res.status(404).json({ message: "해당 아이템을 찾을 수 없습니다." });
    }
    res.status(200).json({
      message: "아이템이 성공적으로 수정되었습니다.",
      item: updatedItem,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = itemsRouter;
