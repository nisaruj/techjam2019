var express = require("express");
var router = express.Router();
const robots = {};

const validatePos = pos => {
  if (pos === undefined || pos.x === undefined || pos.y === undefined)
    return false;
  return true;
};

const matchRobotId = robotId => {
  const matchId = /^robot#([1-9][0-9]*)$/
  const matched = robotId.match(matchId)
  if (isNaN(matched[1])) {
    throw new Error()
  }
  return parseInt(matchId[1])
}

const getCoordFromPosition = robot_position => {
  try {
    const robot_id = matchRobotId(req.body.first_pos)
    return robots[robot_id].position
  } catch(err) {
    return robot_position
  }
}

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
  let first_pos, second_pos
  const first_pos = getCoordFromPosition(req.body.first_pos)
  const second_pos = getCoordFromPosition(req.body.second_pos)
  res.json({ distance: distance(first_pos, second_pos) });
});

router.put("/robot/:id/position", function(req, res, next) {
  if (!validatePos(req.body.position)) {
    throw new Error();
  }
  robots[req.params.id] = req.body;
  res.status(204).send();
});

router.get("/robot/:id/position", function(req, res, next) {
  res.json({ position: robots[req.params.id].position });
});
module.exports = router;
