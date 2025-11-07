const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserById,
  getUserGames,
  getUserAchievements,
  getUserBadges,
  markGameCompleted,
  deleteUserGame,
  addUserGame,
  unlockAchievement,
} = require("../controllers/userController");

// User auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Read
router.get("/:id", getUserById);
router.get("/:id/games", getUserGames);
router.get("/:id/achievements", getUserAchievements);
router.get("/:id/badges", getUserBadges);

// Create relations
router.post("/:id/games", addUserGame);
router.post("/:id/achievements", unlockAchievement);

// Update
router.put("/:id/games/:gameId/complete", markGameCompleted);

// Delete
router.delete("/:id/games/:gameId", deleteUserGame);

module.exports = router;
