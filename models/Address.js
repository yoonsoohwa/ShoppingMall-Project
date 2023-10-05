const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
  {
    postnumber: {
      type: Number,
      required: true,
    },
    addressee: {
      type: String,
      required: true,
    },
    pAddress: {
      // detail 주소를 제외한 앞의 주소
      type: String,
      required: true,
    },
    detail: {
      encryptedData: {
        type: String,
        required: true,
      },
      authTag: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = { Address };
