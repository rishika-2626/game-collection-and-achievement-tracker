const express = require("express");
const router = express.Router();
const {
  getAllAchievements,
  getAchievementsByGame,
} = require("../controllers/achievementController");

router.get("/", getAllAchievements);
router.get("/:id", getAchievementsByGame);

module.exports = router;
