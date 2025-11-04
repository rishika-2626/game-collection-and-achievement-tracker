const express = require("express");
const router = express.Router();

const db = require("../config/db");

const { getUserById, getUserGames, getUserAchievements, getUserBadges } = require("../controllers/userController");

router.get("/:id", getUserById);
router.get("/:id/games", getUserGames);
router.get("/:id/achievements", getUserAchievements);
router.get("/:id/badges", getUserBadges);

module.exports = router;
