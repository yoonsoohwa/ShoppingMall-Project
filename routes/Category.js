// Category (추가, 수정, 삭제)
// 카테고리 추가
const { Router } = require("express");
const { Category } = require("../models/Category");

const categoryRouter = Router();

// POST /api/v1/categories - 카테고리 추가
categoryRouter.post("/", async (req, res, next) => {
  const { name } = req.body;

  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({
      message: "카테고리가 성공적으로 추가되었습니다.",
      category: newCategory,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/categories/:id - 카테고리 수정
categoryRouter.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true } // 업데이트된 카테고리를 반환
    );

    if (!updatedCategory) {
      res.status(404).json({ message: "해당 카테고리를 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: "카테고리가 성공적으로 수정되었습니다.",
      category: updatedCategory,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/categories/:id - 카테고리 삭제
categoryRouter.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndRemove(id);

    if (!deletedCategory) {
      res.status(404).json({ message: "해당 카테고리를 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: "카테고리가 성공적으로 삭제되었습니다.",
      category: deletedCategory,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = categoryRouter;
