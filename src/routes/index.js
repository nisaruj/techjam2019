var express = require("express");
var router = express.Router();

const distance = (first_pos, second_pos) => {
  if (
    first_pos === undefined ||
    second_pos === undefined ||
    first_pos.x === undefined ||
    first_pos.y === undefined ||
    second_pos.x === undefined ||
    second_pos.y === undefined
  ) {
    throw new Error();
  }

  return Math.sqrt(
    (first_pos.x - second_pos.x) * (first_pos.x - second_pos.x) +
      (first_pos.y - second_pos.y) * (first_pos.y - second_pos.y)
  );
};

/* GET home page. */
router.get("/", function(req, res, next) {
  res.json({ message: "Hello world!" });
});

/* Base line Feature. */
router.post("/distance", function(req, res, next) {
  res.json({ distance: distance(req.body.first_pos, req.body.second_pos) });
});

module.exports = router;
