const mongoose = require("mongoose");

const { Schema } = mongoose;
// id, category, image, detail_image, name, price, option, content
// 필수 요소 : name, category, image, price
const itemSchema = new Schema(
  {
    category: {
      // ref
      type: String,
      ref: "Category",
      required: true,
    },
    image: {
      // ref
      type: Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    detail_image: [
      {
        type: String,
      },
    ],
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    option: {
      // 배열로 할 지 지켜봐야함...
      size: String,
      color: String,
    },
    content: {
      type: String, // 필요에 따라 추가 정보를 담을 수 있는 필드
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
