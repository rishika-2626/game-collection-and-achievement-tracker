const db = require("../config/db");

// Get user details by ID
const getUserById = (req, res) => {
  const userId = req.params.id;
  console.log("Request for user ID:", userId);

  const q = "SELECT * FROM User WHERE user_id = ?";
  db.query(q, [userId], (err, result) => {
    if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: err });
    }
    console.log("DB Result:", result);
    if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(result[0]);
  });
};


// Get all games played by the user
const getUserGames = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT DISTINCT g.game_id, g.title, g.release_year, p.name AS platform
    FROM Game g
    JOIN Game_Platform gp ON g.game_id = gp.game_id
    JOIN Platform p ON gp.platform_id = p.platform_id
    JOIN User_Game ug ON g.game_id = ug.game_id
    WHERE ug.user_id = ?;
  `;
  db.query(q, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

// Get all achievements for a user
const getUserAchievements = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT a.achievement_id, a.title AS achievement_title, a.points, g.title AS game_title
    FROM User_Achievement ua
    JOIN Achievement a ON ua.achievement_id = a.achievement_id
    JOIN Game g ON a.game_id = g.game_id
    WHERE ua.user_id = ?;
  `;
  db.query(q, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

// Get all badges for a user
const getUserBadges = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT b.badge_id, b.name AS badge_name, b.description, b.criteria
    FROM User_Badge ub
    JOIN Badge b ON ub.badge_id = b.badge_id
    WHERE ub.user_id = ?;
  `;
  db.query(q, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};


module.exports = {
  getUserById,
  getUserGames,
  getUserAchievements,
  getUserBadges,
};
