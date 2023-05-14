const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./middlewares/jwt.middleware");
const errorHandler = require("./middlewares/error-handling.middleware");
const wrongPathHandler = require("./middlewares/wron-path-handling.middleware");

const app = express();
app.use(cors());
app.options("*", cors());

require("dotenv/config");
const api = process.env.API_URL;

const productRoutes = require("./routes/products.routes");
const categoriesRoutes = require("./routes/categories.routes");
const ordersRoutes = require("./routes/orders.routes");
const usersRoutes = require("./routes/users.routes");

//Middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//Routers
app.use(`${api}/products`, productRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(errorHandler);
app.use(wrongPathHandler);
app.use((err, req, res, next) => {
  return res.send({ message: err });
});

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.DATABASE_CONNECTION_STRING)
  .then(() => {
    console.log("Connection to DB succesfull");
    app.listen(3000, () => {
      console.log("Server is up on http://localhost:3000/");
    });
  })
  .catch((error) => {
    console.log(error);
  });
