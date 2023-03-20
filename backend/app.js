const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./middlewares/jwt.middleware");
const errorHandler = require("./middlewares/error-handling.middleware");

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
app.use(errorHandler);

//Routers
app.use(`${api}/products`, productRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/users`, usersRoutes);

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.DATABASE_CONNECTION_STRING)
  .then(() => {
    console.log("Connection to DB succesfull");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log("Server is up on http://localhost:3000/");
});
