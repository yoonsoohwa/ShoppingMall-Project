// models/category.js

const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  names: [
    {
      type: String,
      required: true,
    },
  ],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
