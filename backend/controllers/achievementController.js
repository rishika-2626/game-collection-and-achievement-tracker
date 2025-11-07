const db = require("../config/db");

// Get all achievements
const getAllAchievements = (req, res) => {
  const q = `
    SELECT a.achievement_id, a.title, a.points, g.title AS game_title
    FROM Achievement a
    JOIN Game g ON a.game_id = g.game_id;
  `;
  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Get achievements for a specific game
const getAchievementsByGame = (req, res) => {
  const gameId = req.params.id;
  const q = `
    SELECT a.achievement_id, a.title, a.description, a.points
    FROM Achievement a
    WHERE a.game_id = ?;
  `;
  db.query(q, [gameId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

module.exports = { getAllAchievements, getAchievementsByGame };
