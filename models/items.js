const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  option: {
    size: String,
    color: String,
  },
  image: {
    type: String,
    required: true, // 이미지는 필수 필드
  },
  detail_image: [{
    type: String,
  }],
  category: {
    type: String,
    enum: ['All', 'Top', 'Bottom', 'etc'], // 우선 기본값들만 넣었는데 추가기능을 넣어야할 거 같습니다.
    required: true,
  },
  content: {
    type: String, // 필요에 따라 추가 정보를 담을 수 있는 필드
  },
  price: {
    type: Number,
    required: true, // 가격은 필수 필드
  },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
