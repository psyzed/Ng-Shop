const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  shippingAddress1: {
    type: String,
    required: true,
  },
  shippingAddress2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  status: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

exports.Order = mongoose.model("Order", orderSchema);
