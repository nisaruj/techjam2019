var express = require("express");
var createError = require("http-errors");
var router = express.Router();
var allShortest = require("util");
const robots = {};
const aliens = {};

const validatePos = pos => {
  if (pos === undefined || pos.x === undefined || pos.y === undefined)
    return false;
  return true;
};

const validateObject = obj => {
  if (
    obj === undefined ||
    obj.robot_id === undefined ||
    obj.distance === undefined
  )
    return false;
  return true;
};

const matchRobotId = robotId => {
  const matchId = /^robot#([1-9][0-9]*)$/;
  const matched = robotId.match(matchId);
  if (isNaN(matched[1])) {
    throw new Error();
  }
  return parseInt(matched[1]);
};

const getCoordFromPosition = robot_position => {
  try {
    const robot_id = matchRobotId(robot_position);
    if (robots[robot_id]) return robots[robot_id].position;
    else return createError(424);
  } catch (err) {
    return robot_position;
  }
};

const distance = (first_pos, second_pos, type = "euclidean") => {
  if (!validatePos(first_pos) || !validatePos(second_pos)) {
    throw new Error();
  }

  if (type === "manhattan") {
    return (
      Math.abs(first_pos.x - second_pos.x) +
      Math.abs(first_pos.y - second_pos.y)
    );
  } else if (type === "euclidean") {
    return Math.sqrt(
      (first_pos.x - second_pos.x) * (first_pos.x - second_pos.x) +
        (first_pos.y - second_pos.y) * (first_pos.y - second_pos.y)
    );
  } else {
    throw new Error();
  }
};

const findNearest = (position, k = 1) => {
  if (!validatePos(position)) throw new Error();
  let distList = [];
  let nearestDist = undefined,
    nearestId = undefined;

  for (let key in robots) {
    if (nearestDist === undefined) {
      nearestDist = distance(position, robots[key].position);
      nearestId = key;
      distList.push({
        id: key,
        dist: distance(position, robots[key].position)
      });
      continue;
    }
    let dist = distance(position, robots[key].position);
    distList.push({ id: key, dist });
    if (
      dist < nearestDist ||
      (dist == nearestDist && parseInt(key) < parseInt(nearestId))
    ) {
      nearestId = key;
      nearestDist = dist;
    }
  }
  if (k == 1) {
    return nearestId ? [parseInt(nearestId)] : [];
  } else {
    distList.sort((a, b) => a.dist - b.dist);
    return distList.slice(0, k).map(obj => parseInt(obj["id"]));
  }
};

const allShortestDistance = () => {
  let mn = undefined;
  for (let k1 in robots) {
    for (let k2 in robots) {
      if (k1 === k2) continue;
      const dis = distance(robots[k1].position, robots[k2].position);
      if (mn === undefined) mn = dis;
      if (dis < mn) {
        mn = dis;
      }
    }
  }
  return mn;
};

const getXFromDir = pos => {
  const result = {};
  if (pos["east"] !== undefined) {
    result["x"] = pos["east"];
  } else if (pos["west"] !== undefined) {
    result["x"] = -1 * pos["west"];
  } else {
    result["x"] = pos["x"];
  }
  return result;
};

const getYFromDir = pos => {
  const result = {};
  if (pos["north"] !== undefined) {
    result["y"] = pos["north"];
  } else if (pos["south"] !== undefined) {
    result["y"] = -1 * pos["south"];
  } else {
    result["y"] = pos["y"];
  }
  return result;
};

/* GET home page. */
router.get("/", function(req, res, next) {
  res.json({ message: "Hello world!" });
});

/* Baseline Feature. */
router.post("/distance", function(req, res, next) {
  const first_pos = getCoordFromPosition(req.body.first_pos);
  const second_pos = getCoordFromPosition(req.body.second_pos);

  res.json({ distance: distance(first_pos, second_pos, req.body.metric) });
});

router.put("/robot/:id/position", function(req, res, next) {
  if (!validatePos(req.body.position)) {
    throw new Error();
  }
  robots[parseInt(req.params.id)] = req.body;
  res.status(204).send();
});

router.get("/robot/:id/position", function(req, res, next) {
  if (robots[req.params.id] === undefined) {
    res.status(404).send();
  }
  res.json({ position: robots[req.params.id].position });
});

router.post("/nearest", function(req, res, next) {
  res.json({ robot_ids: findNearest(req.body.ref_position, req.body.k) });
});

module.exports = router;
