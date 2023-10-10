const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../logger/logger");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const userList = await User.find().select("-passwordHash");

    return res.send(userList);
  } catch (error) {
    logger.usersRoutesErrorLogger.log("Error", {
      requestType: "GET",
      message: "Server error while trying to fetch users.",
    });
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong!" });
  }
});

router.get("/totalusers", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    if (totalUsers) {
      return res.status(200).send({ totalUsers });
    }
  } catch (error) {
    logger.usersRoutesErrorLogger.log("Error", {
      requestType: "GET",
      message: "Server error while trying to fetch users count.",
    });
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.usersRoutesErrorLogger.log("Error", {
      requestType: "GET",
      message: "Invalid mongoDB id provided",
    });
    return res.status(400).send("Invalid mongoDB id");
  }
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).send({ success: false, message: "User not found!" });
    } else {
      res.status(200).send({ success: true, user: user });
    }
  } catch (error) {
    logger.usersRoutesErrorLogger.log("Error", {
      requestType: "GET",
      message: "Internal server error",
    });
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later!",
    });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.usersRoutesErrorLogger.log("Error", {
      requestType: "PUT",
      message: "Invalid mongoDB id provided",
    });
    return res.status(400).send("Invalid mongoDB id");
  }
  try {
    const userToUpdate = await User.findById(id);
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
      logger.usersRoutesErrorLogger.log("Error", {
        requestType: "PUT",
        message: "Error finding user in db",
      });
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    } else {
      return res
        .status(200)
        .send({ success: true, message: "User updated!", user: user });
    }
  } catch (error) {
    logger.usersRoutesErrorLogger.log("Error", {
      requestType: "PUT",
      message: "Internal Server Error",
    });
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
  try {
    user = await user.save();

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User could not be created!" });
    }
    return res.status(200).send({ user: user, message: "User Created!" });
  } catch (error) {
    logger.usersRoutesErrorLogger.log("Error", {
      requestType: "POST",
      message: "Internal Server Error",
    });
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
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

  try {
    user = await user.save();

    if (!user) {
      logger.usersRoutesErrorLogger.log("Error", {
        requestType: "POST",
        message: "Error during registration",
      });
      return res
        .status(400)
        .send({ success: false, message: "User could not be created!" });
    }
    return res.status(200).send({ user: user, message: "User Created!" });
  } catch (error) {
    logger.usersRoutesErrorLogger.log("Error", {
      requestType: "POST",
      message: "Internal Server Error",
    });
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;

    if (!user) {
      logger.usersRoutesErrorLogger.log("error", {
        requestType: "POST",
        message: "Error finding user while trying to log in",
      });
      return res.status(400).send({
        success: false,
        message: "There is now user with this email.",
      });
    } else if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: "1h" }
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
  } catch (error) {
    logger.usersRoutesErrorLogger.log("Error", {
      requestType: "POST",
      message: "Internal Server Error on login",
    });
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.usersRoutesErrorLogger.log("error", {
      requestType: "DELETE",
      message: "Invalid mongoDB id",
    });
    return res.status(400).send("Invalid mongoDB id");
  }
  try {
    const user = await User.findByIdAndRemove(id);
    if (user) {
      return res.status(200).send({ success: true, message: "User Deleted!" });
    } else {
      console.log("here");
      logger.usersRoutesErrorLogger.log("error", {
        requestType: "DELETE",
        message: "Unable to find user",
      });
      return res
        .status(404)
        .send({ success: false, message: "User not found!" });
    }
  } catch (error) {
    logger.usersRoutesErrorLogger.log("error", {
      requestType: "DELETE",
      message: "Internal server error",
    });
    return res.status(500).send({
      success: false,
      message: "Something went wrong, please try again later...",
    });
  }
});

module.exports = router;
