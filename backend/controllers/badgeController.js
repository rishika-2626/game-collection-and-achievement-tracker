const db = require("../config/db");

// Get all badges
const getAllBadges = (req, res) => {
  const q = `SELECT * FROM Badge;`;
  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Get a badge by ID
const getBadgeById = (req, res) => {
  const badgeId = req.params.id;
  const q = `SELECT * FROM Badge WHERE badge_id = ?;`;
  db.query(q, [badgeId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

module.exports = { getAllBadges, getBadgeById };
