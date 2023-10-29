const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const express = require("express");
const router = express.Router();
const logger = require("../logger/logger");
const mongoose = require("mongoose");

router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).send({ success: false });
  }
  res.send(orderList);
});

router.get(`/userorders/:userid`, async (req, res) => {
  const userOrders = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrders) {
    res.status(500).send({ success: false });
  }
  res.send(userOrders);
});

router.get("/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({ totalSales: totalSales.pop().totalsales });
});

router.get("/totalorders", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    if (totalOrders) {
      res.status(200).send({ totalOrders });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Unable to get order count!" });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later.",
    });
  }
});

router.get(`/:id`, async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.ordersRoutesErrorLogger.log(
      "error",
      "Invalid mongoDB id provided while trying to fetch."
    );
    return res.status(400).send({ message: "Invalid order id provided." });
  }

  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });

    if (!order) {
      return res
        .status(404)
        .send({ success: false, message: "Order not found" });
    }
    res.send(order);
  } catch (error) {
    res.status(500).send({ success: false, message: "Something went wrong." });
  }
});

router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem._id,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  let totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone.replace(/\D+/g, ""),
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user.id,
  });

  order = await order.save();

  if (!order) {
    return res
      .status(400)
      .send({ success: false, message: "Order could not be created!" });
  } else {
    return res.status(200).send({ success: true, order: order });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (order) {
      res
        .status(200)
        .send({ success: true, message: "Status updated!", order: order });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Something went wrong." });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndRemove(req.params.id).then(async (order) => {
      if (order) {
        await Promise.all(
          order.orderItems.map((orderItemId) =>
            OrderItem.findByIdAndRemove(orderItemId).then((orderItem) => {
              if (!orderItem) {
                console.log(`OrderItem ${orderItemId} not found`);
              }
            })
          )
        );
        res
          .status(200)
          .send({ success: true, message: "Order Deleted!", order: order });
      } else {
        res
          .status(404)
          .send({ success: false, message: "Order does not exist" });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong, try again later.",
      error: error,
    });
  }
});

module.exports = router;
