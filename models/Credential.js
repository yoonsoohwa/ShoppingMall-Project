const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const credentialSchema = new Schema(
  {
    phoneNumber: {
      type: Number,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Credential = mongoose.model("Credential", credentialSchema);

module.exports = { Credential };
