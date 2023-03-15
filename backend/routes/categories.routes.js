const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).send({ success: false });
  }
  res.status(200).send(categoryList);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res
      .status(404)
      .send({ message: "The category with the given id was not found." });
  }
  res.status(200).send(category);
});

router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  category = await category.save();
  if (!category) {
    return res.status(404).send("The category cannot be created!");
  }
  res.status(200).send(category);
});

router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
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
  res.status(200).send(category);
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (category) {
      return res
        .status(200)
        .send({ success: true, message: "Category Deleted!" });
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
