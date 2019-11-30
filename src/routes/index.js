var express = require("express");
var router = express.Router();
const robots = {};

const validatePos = pos => {
  if (pos === undefined || pos.x === undefined || pos.y === undefined)
    return false;
  return true;
};

const distance = (first_pos, second_pos) => {
  if (!validatePos(first_pos) || !validatePos(second_pos)) {
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

/* Baseline Feature. */
router.post("/distance", function(req, res, next) {
  res.json({ distance: distance(req.body.first_pos, req.body.second_pos) });
});

router.put("/robot/:id/position", function(req, res, next) {
  if (!validatePos(req.body.position)) {
    throw new Error();
  }
  robots[req.params.id] = req.body;
  res.status(204).send();
});

router.get("/robot/:id/position", function(req, res, next) {
  if (robots[req.params.id] === undefined) {
    res.status(404).send();
  }
  res.json({ position: robots[req.params.id].position });
});
module.exports = router;
