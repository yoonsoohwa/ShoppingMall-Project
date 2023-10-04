const mongoose = require('mongoose');
const { Schema } = mongoose;
// id, category, image, detail_image, name, price, option, content
// 필수 요소 : name, category, image, price 
const itemSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'All', 
      'Top', 
      'Outer', 
      'Bottom', 
      'Dress', 
      'Bag', 
      'Shoes', 
      'Hat', 
      'Acc', 
      'Etc'
    ],
    required: true,
  },
  image: {
    type: String,
    required: true, // 이미지는 필수 필드
  },
  detail_image: [{
    type: String,
  }],
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true, // 가격은 필수 필드
  },
  option: {
    size: String,
    color: String,
  },
  content: {
    type: String, // 필요에 따라 추가 정보를 담을 수 있는 필드
  },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
