const express = require("express");
const router = express.Router();
const { getAllBadges, getBadgeById } = require("../controllers/badgeController");

router.get("/", getAllBadges);
router.get("/:id", getBadgeById);

module.exports = router;
