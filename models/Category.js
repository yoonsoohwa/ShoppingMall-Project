// type, items
// enum: [
//     'All',
//     'Top',
//     'Outer',
//     'Bottom',
//     'Dress',
//     'Bag',
//     'Shoes',
//     'Hat',
//     'Acc',
//     'Etc'
//   ],
const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "All",
        "Top",
        "Outer",
        "Bottom",
        "Dress",
        "Bag",
        "Shoes",
        "Hat",
        "Acc",
        "Etc",
      ],
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item", // "Item" 모델을 참조
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
