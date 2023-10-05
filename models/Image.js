// imageType, url

const mongoose = require("mongoose");

const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    imageType: {
      // 대표이미지, 상세이미지
      type: String,
      enum: ["thumbnail", "detail"],
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
