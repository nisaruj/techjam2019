var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.send("This is private endpoint.");
});

module.exports = router;
