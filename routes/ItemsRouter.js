const { Router } = require("express");
const { Item } = require("../models/items");

const itemsRouter = Router();

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
    const itemsInCategory = await Item.find({ Category: category });
    res.status(200).json(itemsInCategory);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/items
itemsRouter.post("/", async (req, res, next) => {
  const newItem = new Item(req.body);
  try {
    await newItem.save();
    res.status(201).json({ message: "아이템이 성공적으로 추가되었습니다.", item: newItem });
  } catch (err) {
    next(err);
  }
});

module.exports = itemsRouter;
