const express = require("express");
const router = express.Router();
const analytics = require("../controllers/analyticsController");

// Routes for user analytics
router.get("/:id/total-points", analytics.getUserTotalPoints);
router.get("/:id/total-games", analytics.getUserTotalGames);
router.get("/:id/completed-games", analytics.getUserCompletedGames);
router.get("/:id/unlocked-achievements", analytics.getUserUnlockedAchievements);
router.get("/:id/badges", analytics.getUserBadges);
router.get("/:id/games", analytics.getUserGamesList);
router.get("/:id/achievements-per-game", analytics.getAchievementsPerGame);
router.get("/top-games", analytics.getTopGamesByPoints);
router.get("/:id/points-over-time", analytics.getPointsOverTime);
router.get("/:id/completion-rate", analytics.getCompletionRateByGenre);
router.get("/leaderboard", analytics.getLeaderboard);
router.get("/:gameId/top-achievers", analytics.getTopAchieversPerGame);
router.get("/:id/most-played-genre", analytics.getMostPlayedGenre);
router.get("/:id/recent-games", analytics.getRecentGames);
router.get("/:id/top-point-achievements", analytics.getTopPointAchievements);
router.get("/:id/remaining-achievements", analytics.getRemainingAchievements);
router.get("/:id/platforms-used", analytics.getPlatformsMostUsed);
router.get("/:id/games-per-month", analytics.getGamesCompletedPerMonth);
router.get("/:id/points-per-month", analytics.getPointsEarnedPerMonth);
router.get("/:id/players-ahead", analytics.getPlayersAhead);
router.get("/common-badges", analytics.getMostCommonBadges);
router.get("/:id/badges-not-earned", analytics.getBadgesNotEarned);
// For Game Info Page
router.get("/game/:gameId", analytics.getGameById);
router.get("/:userId/game/:gameId/achievements", analytics.getAchievementsForGame);
router.get("/game/:gameId/top-users", analytics.getTopUsersForGame);
router.get("/:userId/game/:gameId/points-over-time", analytics.getGamePointsOverTime);
//router.get("/game/:gameId/completion-rate", analytics.getGameCompletionRate);

module.exports = router;
