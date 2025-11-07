const express = require("express");
const router = express.Router();
const { getAllGames, getGameById } = require("../controllers/gameController");

router.get("/", getAllGames);
router.get("/:id", getGameById);

module.exports = router;
