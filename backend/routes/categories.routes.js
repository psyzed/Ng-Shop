const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const logger = require("../logger/logger");
const mongoose = require("mongoose");

//Get Categories List
router.get(`/`, async (req, res) => {
  try {
    const categoryList = await Category.find();

    if (!categoryList) {
      logger.categoriesRoutesErrorLogger.log(
        "error",
        "Fetching categories list failed."
      );
      return res.status(500).send({ success: false });
    }
    return res.status(200).send(categoryList);
  } catch (error) {
    console.log(error);
    logger.categoriesRoutesErrorLogger.log(
      "error",
      "Server Error while fetching category list"
    );
    return res.status(500).send({ error: error, message: "Server Error" });
  }
});

//Get Category by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.categoriesRoutesErrorLogger.log(
      "error",
      "Invalid category id provided while trying to fetch."
    );
    return res.status(400).send({ message: "Invalid category id provided." });
  }
  try {
    const category = await Category.findById(id);
    if (!category) {
      logger.categoriesRoutesErrorLogger.log(
        "error",
        "Category not found with the given id."
      );
      return res
        .status(404)
        .send({ message: "Category not found with the given id." });
    }
    return res.status(200).send(category);
  } catch (error) {
    console.log(error);
    logger.categoriesRoutesErrorLogger.log(
      "error",
      "Server Error finding a category by id"
    );
    return res.status(500).send({ error: error, message: "Server Error" });
  }
});

//Adding a new category
router.post("/", async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    category = await category.save();
    if (!category) {
      logger.categoriesRoutesErrorLogger.log(
        "error",
        "Error while creating category."
      );
      return res.status(404).send("The category cannot be created!");
    }
    return res.status(200).send(category);
  } catch (error) {
    logger.categoriesRoutesErrorLogger.log(
      "error",
      "Server Error adding a category"
    );
    return res.status(500).send({ error: error, message: "Server Error" });
  }
});

//Editing a category
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.categoriesRoutesErrorLogger.log(
      "error",
      "Invalid category id provided while trying to update."
    );
    return res.status(400).send({ message: "Invalid category id provided" });
  }
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true }
    );
    if (!category) {
      return res
        .status(404)
        .send("The category cannot be udated cause it doesn't exist!");
    }
    return res.status(200).send(category);
  } catch (error) {
    logger.categoriesRoutesErrorLogger.log(
      "error",
      "Server Error Updating a category"
    );
    return res.status(500).send({ error: error, message: "Server Error" });
  }
});

//Deleting a category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (category) {
      return res.send(category);
    } else {
      return res
        .status(404)
        .send({ success: false, message: "Category not found!" });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later...",
    });
  }
});

module.exports = router;
