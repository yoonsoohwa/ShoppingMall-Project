const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

const pingRouter = require("./router/PingRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

dotenv.config();

// // mongoose
// mongoose
//   .connect(process.env.MONGO_URI, {
//     dbName: process.env.MONGO_DB_NAME,
//   })
//   .then(() => console.log("MongoDB Connected..."))
//   .catch((err) => console.log(err));

const categoryPath = __dirname + '/views/pages/Categorypage';


// router
app.get('/category', (req, res) => {
  res.sendFile(categoryPath + '/category.html')
});




app.get('/api/category/best', (req, res) => {

  res.send([{
    name: '네이비 에코백',
    price: 100000,
    src: '/static/images/navybag.jpeg',
    link: 'https://jjongtaeng.github.io/linkevery'
  },
  {
    name: '체크무늬 에코백',
    price: 120000,
    src: '/static/images/checkback.jpeg',
    link: 'https://jjongtaeng.github.io/linkevery'
  },{
    name: '초록 에코백',
    price: 87500,
    src: '/static/images/greenbag.jpeg',
    link: 'https://jjongtaeng.github.io/linkevery'
  },{
    name: '파랑 에코백',
    price: 19000,
    src: '/static/images/bluebag.jpeg',
    link: 'https://jjongtaeng.github.io/linkevery'
  }])
})

// app.use("/api/ping", pingRouter);

// // error handling
// app.use((err, req, res) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Something went wrong.";
//   res.status(statusCode);
//   res.json({ message });
// });

// port
// const port = process.env.PORT;
const port = 5050;

app.listen(port, () => {
  console.log(`Connecting to PORT ${port}`);
});
