const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

const pingRouter = require("./routes/PingRouter");
const orderRouter = require("./routes/OrderRouter");
const itemsRouter = require("./routes/ItemsRouter");
const userRouter = require("./routes/UserRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// dotenv
dotenv.config();

// mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// router

app.use("/api/v1/ping", pingRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/items", itemsRouter);
app.use("/api/v1/users", userRouter);

// error handling
app.use((err, req, res) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong.";
  res.status(statusCode);
  res.json({ message });
});

// port
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Connecting to PORT ${port}`);
});
