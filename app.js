const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

const pingRouter = require("./routes/PingRouter");
const orderRouter = require("./routes/OrderRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

console.log(
  `어플리케이션 서버를 다음 환경으로 시작합니다: ${process.env.NODE_ENV}`
);
if (process.env.NODE_ENV === "dev") {
  dotenv.config({ path: ".env" });
}
if (process.env.NODE_ENV === "prod") {
  dotenv.config({ path: ".env.prod" });
}

// mongoose
// mongoose
//   .connect(process.env.MONGO_URI, {
//     dbName: process.env.MONGO_DB_NAME,
//   })
//   .then(() => console.log("MongoDB Connected..."))
//   .catch((err) => console.log(err));

const categoryPath = __dirname + '/views/pages/Categorypage';


// router
/*
  프론트 HTML 파일 내려줄 라우팅이 필요하다.
  프론트는 이렇게 HTML내려주고, JS, CSS는 public 아래에 생성해서 static 경로로 연결해야될 것 같다.
    프론트 CSS랑 JS는 어떻게 연결해서 쓰고있는건지? => 이거 얘기하긴해야함.
  app.use('/static', express.static('public')); 이 코드 추가해서 dev에 올려주시면 제가 작업하는 브랜치에서 머지해서 가져다 쓰겠다.
 */
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

// app.use("/api/v1/ping", pingRouter);
app.use("/api/v1/orders", orderRouter);

// error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong.";
  res.status(statusCode);
  res.json({ message });
});

// port
// const port = process.env.PORT;
const port = 5050;

app.listen(port, () => {
  console.log(`Connecting to PORT ${port}`);
});
