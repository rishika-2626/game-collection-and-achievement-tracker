const express = require("express");
const router = express.Router();

// No direct badge routes needed. Badges are awarded through evaluateBadges()
// and fetched using /users/:id/badges in userRoutes.

module.exports = router;
