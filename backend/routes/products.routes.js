const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const { count } = require("console");

router.get("/", async (req, res) => {
  let queryParams = {};
  if (req.query.categories) {
    queryParams = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(queryParams).select("name category id");

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send(productList);
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product with this id does not exist!",
      });
    } else {
      res.send(product);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
});

router.post("/", async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(404).send("This category does not exist.");
  }

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) {
    return res
      .status(500)
      .send("Product was not created! Please try again later.");
  }
  res.send(product);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(404)
      .json({ success: false, message: "The provided id is wrong!" });
  try {
    const category = await Category.findById(req.body.category);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Not valid Category" });
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: "The product with this id does not exist!",
      });
    } else {
      res.status(200).send(product);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, try again later!",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (product) {
      return res
        .status(200)
        .json({ success: true, message: "Product Deleted!" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later...",
    });
  }
});

router.get("/get/count", async (req, res) => {
  try {
    const totalProductCount = await Product.countDocuments();
    if (totalProductCount) {
      return res
        .status(200)
        .json({ success: true, totalProductCount: totalProductCount });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
});

router.get("/get/featured/:count?", async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const featuredProducts = await Product.find({ isFeatured: true }).limit(
      +count
    );
    if (featuredProducts) {
      return res
        .status(200)
        .json({ success: true, featuredProducts: featuredProducts });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "There are no featured products!" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try later!",
    });
  }
});

module.exports = router;
