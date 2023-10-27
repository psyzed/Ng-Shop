const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const { count } = require("console");
const multer = require("multer");
const logger = require("../logger/logger");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

//Multer config
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

//Getting list of products
router.get("/", async (req, res) => {
  let queryParams = {};
  if (req.query.categories) {
    queryParams = { category: req.query.categories.split(",") };
  }

  if (req.query.search) {
    const searchQuery = new RegExp(req.query.search, "i");

    queryParams.$or = [{ name: searchQuery }, { brand: searchQuery }];
  }

  try {
    const productList = await Product.find(queryParams).populate("category");

    if (!productList) {
      logger.productsRoutesErrorLogger.log(
        "error",
        "Error while fetching products list"
      );
      return res.status(500).send({
        success: false,
        message: "Something went wrong, please try again later",
      });
    } else {
      res.send(productList);
    }
  } catch (error) {
    logger.productsRoutesErrorLogger.log(
      "server-error",
      "Server error while fetching products list"
    );
    return res.status(500).send({ success: false, message: "Server error" });
  }
});

//Getting product by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.productsRoutesErrorLogger.log(
      "error",
      "Invalid mongo id provided when trying to find a product by id"
    );
    return res.status(400).send({ message: "Invalid category id provided." });
  }
  try {
    const product = await Product.findById(id).populate("category");
    if (!product) {
      logger.productsRoutesErrorLogger.log(
        "error",
        "Error while fetching product by id"
      );
      return res.status(404).send({
        success: false,
        message: "Product with this id does not exist!",
      });
    } else {
      res.send(product);
    }
  } catch (error) {
    logger.productsRoutesErrorLogger.log(
      "error",
      "Error while fetching products list"
    );
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
});

//Post Request for getting multiple products by id
router.post("/getProductsByIds", async (req, res) => {
  const ids = req.body.ids;
  if (!ids || ids.length === 0) {
    logger.productsRoutesErrorLogger.log(
      "error",
      "No ids provided when trying to find multiple products by id"
    );
    return res.status(400).send({ message: "No ids provided." });
  }

  const verifiedIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
  let warningMessage = "";

  if (verifiedIds.length === 0) {
    logger.productsRoutesErrorLogger.log(
      "error",
      "Invalid mongo ids provided when trying to find multiple products by id"
    );
    return res.status(400).send({ message: "Invalid ids provided." });
  }

  if (ids.length !== verifiedIds.length) {
    logger.productsRoutesErrorLogger.log(
      "error",
      "Some invalid mongo ids provided when trying to find multiple products by id"
    );
    warningMessage = "Some ids are invalid.";
  }

  try {
    const products = await Product.find({ _id: { $in: verifiedIds } }, "name price image");

    if (!products || products.length === 0) {
      return res.status(404).send({ message: "No products found!" });
    }
    res.status(200).send({ message: warningMessage, data: products });
  } catch (error) {
    logger.productsRoutesErrorLogger.log(
      "error",
      "Error while fetching multiple products by id"
    );
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
});

//Adding a new product
router.post("/", uploadOptions.single("image"), async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);

    if (!category) {
      logger.productsRoutesErrorLogger.log(
        "cad-request-error",
        "Error find the category when adding a new product"
      );
      return res.status(404).send("This category does not exist.");
    }

    const imageFile = req.file;
    if (!imageFile) {
      logger.productsRoutesErrorLogger.log("error", "No image file provided");
      return res
        .status(400)
        .send({ success: false, message: "No image file provided" });
    }

    const fileName = imageFile.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

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
      logger.productsRoutesErrorLogger.log(
        "bad-request-error",
        "Error while adding a new product"
      );
      return res
        .status(500)
        .send("Product was not created! Please try again later.");
    }
    return res.status(200).send(product);
  } catch (error) {
    logger.productsRoutesErrorLogger.log("server-error", "Server Error");
    return res.status(500).send({ error: error, message: "Server Error" });
  }
});

//Updating a product
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    logger.productsRoutesErrorLogger.log(
      "id-error",
      "Invalid mongo id provided when trying to update a product by id"
    );
    return res
      .status(404)
      .send({ success: false, message: "Invalind mongoDB id" });
  }
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      logger.productsRoutesErrorLogger.log(
        "error",
        "Category not found while trying to update a product"
      );
      return res
        .status(404)
        .send({ success: false, message: "Not valid Category" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.productsRoutesErrorLogger.log(
        "bad-request-error",
        "Error updating the product"
      );
      return res.status(400).send("Invalid product");
    }

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
      logger.productsRoutesErrorLogger.log(
        "bad-request-error",
        "Error finding the updated product"
      );
      return res.status(404).send({
        success: false,
        message: "The product with this id does not exist!",
      });
    } else {
      return res.status(200).send(updatedProduct);
    }
  } catch (error) {
    logger.productsRoutesErrorLogger.log(
      "server-error",
      "Server error while updating a product"
    );
    return res.status(500).send({
      success: false,
      message: "Something went wrong, try again later!",
      error: error,
    });
  }
});

//Update product image gallery
router.put(
  "/gallery/images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      logger.productsRoutesErrorLogger.log(
        "id-error",
        "Invalid mongo id provided when trying to update images of product by id"
      );
      return res
        .status(404)
        .send({ success: false, message: "The provided id is wrong!" });
    }
    try {
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
        logger.productsRoutesErrorLogger.log(
          "bad-request-error",
          "Error finding the product"
        );
        res.status(404).send({
          success: false,
          message: "The product with this id does not exist!",
        });
      } else {
        return res.status(200).send(product);
      }
    } catch (error) {
      logger.productsRoutesErrorLogger.log(
        "server-error",
        "Server error while updating a products images"
      );
      return res.status(500).send({
        success: false,
        message: "Something went wrong, try again later!",
        error: error,
      });
    }
  }
);

//Deleting a product
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    logger.productsRoutesErrorLogger.log(
      "id-error",
      "Invalid mongo id provided when trying to delete a product by id"
    );
    return res
      .status(404)
      .send({ success: false, message: "The provided id is wrong!" });
  }
  try {
    const product = await Product.findByIdAndRemove(id);
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
    logger.productsRoutesErrorLogger.log(
      "server-error",
      "Server error while deleting a category"
    );
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later...",
    });
  }
});

router.get("/get/totalproducts", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    if (totalProducts) {
      return res.status(200).send({ totalProducts });
    }
  } catch (error) {
    logger.productsRoutesErrorLogger.log(
      "server-error",
      "Error while trying to get the total products count"
    );
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
      return res.status(200).send(featuredProducts);
    } else {
      return res
        .status(404)
        .send({ success: false, message: "There are no featured products!" });
    }
  } catch (error) {
    logger.productsRoutesErrorLogger.log(
      "server-error",
      "Error while trying to get the total featured products count"
    );
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try later!",
    });
  }
});

module.exports = router;
