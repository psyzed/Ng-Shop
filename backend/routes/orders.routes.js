const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find();

  if (!orderList) {
    res.status(500).send({ success: false });
  }
  res.send(orderList);
});

router.post("/", async (req, res) => {
  let orderItems = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        product: orderItem.product,
        quantity: orderItem.quantity,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemsPromiseResolved = await orderItems;
  console.log(orderItemsPromiseResolved);

  let order = new Order({
    orderItems: orderItemsPromiseResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });

  // order = await order.save();

  if (!order) {
    return res
      .status(400)
      .send({ success: false, message: "Order could not be created!" });
  } else {
    return res.status(200).send({ success: true, order: order });
  }
});

module.exports = router;
