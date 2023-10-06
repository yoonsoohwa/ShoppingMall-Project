const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.send("pong");
});

module.exports = router;
