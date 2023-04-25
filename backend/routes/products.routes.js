const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const { count } = require("console");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isFileValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");

    if (isFileValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(" ", "-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get("/", async (req, res) => {
  let queryParams = {};
  if (req.query.categories) {
    queryParams = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(queryParams);

  if (!productList) {
    res.status(500).send({ success: false });
  }

  res.send(productList);
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      res.status(404).send({
        success: false,
        message: "Product with this id does not exist!",
      });
    } else {
      res.send(product);
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
});

router.post("/", uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(404).send("This category does not exist.");
  }

  const imageFile = req.file;
  const fileName = imageFile.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (!imageFile)
    return res
      .status(400)
      .send({ success: false, message: "No image file provided" });

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
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

router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(404)
      .send({ success: false, message: "The provided id is wrong!" });
  try {
    const category = await Category.findById(req.body.category);
    if (!category)
      return res
        .status(404)
        .send({ success: false, message: "Not valid Category" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send("Invalid product");

    const imageFile = req.file;
    let imagePath;
    if (imageFile) {
      const fileName = imageFile.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagePath = `${basePath}${fileName}`;
    } else {
      imagePath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagePath,
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

    if (!updatedProduct) {
      res.status(404).send({
        success: false,
        message: "The product with this id does not exist!",
      });
    } else {
      res.status(200).send(updatedProduct);
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong, try again later!",
      error: error,
    });
  }
});

router.put(
  "/gallery/images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(404)
        .send({ success: false, message: "The provided id is wrong!" });

    const imageFiles = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (imageFiles) {
      imageFiles.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );
    if (!product) {
      res.status(404).send({
        success: false,
        message: "The product with this id does not exist!",
      });
    } else {
      res.status(200).send(product);
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (product) {
      return res
        .status(200)
        .send({ success: true, message: "Product Deleted!" });
    } else {
      return res
        .status(404)
        .send({ success: false, message: "Product not found!" });
    }
  } catch (error) {
    return res.status(500).send({
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
        .send({ success: true, totalProductCount: totalProductCount });
    }
  } catch (error) {
    return res.status(500).send({
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
        .send({ success: true, featuredProducts: featuredProducts });
    } else {
      return res
        .status(404)
        .send({ success: false, message: "There are no featured products!" });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try later!",
    });
  }
});

module.exports = router;
