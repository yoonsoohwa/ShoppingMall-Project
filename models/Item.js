const mongoose = require('mongoose');

const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: {
      type: {
        imageType: {
          type: String,
          enum: ['thumbnail', 'detail'],
        },
        url: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    detail_image: [
      {
        type: {
          imageType: {
            type: String,
            enum: ['thumbnail', 'detail'],
          },
          url: {
            type: String,
            required: true,
          },
        },
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
      size: [
        {
          type: String,
          default: null,
        },
      ],
      color: [
        {
          type: String,
          default: null,
        },
      ],
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
