// 카테고리 추가 기능 추가 필요!!

const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    items: [
      // 카테고리에 속한 Item ObjectID배열
      {
        type: Schema.Types.ObjectId,
        ref: "Item", // Item 모델을 참조
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
