const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).send({ success: false, message: "Something went wrong!" });
  }
  res.send(userList);
});

router.get("/get/count", async (req, res) => {
  try {
    const totalUserCount = await User.countDocuments();
    if (totalUserCount) {
      return res
        .status(200)
        .send({ success: true, totalUserCount: totalUserCount });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).send({ success: false, message: "User not found!" });
    } else {
      res.status(200).send({ success: true, user: user });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userToUpdate = await User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userToUpdate.password;
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        password: newPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
      },
      { new: true }
    );
    if (!user) {
      res.status(404).send({ success: false, message: "User not found" });
    } else {
      res
        .status(200)
        .send({ success: true, message: "User updated!", user: user });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong!" });
  }
});

router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) {
    return res
      .status(400)
      .send({ success: false, message: "User could not be created!" });
  }
  res.status(200).send({ user: user, message: "User Created!" });
});

router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) {
    return res
      .status(400)
      .send({ success: false, message: "User could not be created!" });
  }
  res.status(200).send({ user: user, message: "User Created!" });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;

  if (!user) {
    return res
      .status(400)
      .send({ success: false, message: "There is now user with this email." });
  } else if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    return res.status(200).send({
      success: true,
      message: "User Authenticated",
      user: user.email,
      token: token,
    });
  } else {
    return res
      .status(400)
      .send({ success: false, message: "Wrong Credentials!" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (user) {
      return res.status(200).send({ success: true, message: "User Deleted!" });
    } else {
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later...",
    });
  }
});

module.exports = router;
