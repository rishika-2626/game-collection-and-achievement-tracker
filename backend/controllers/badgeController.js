const db = require("../config/db");

// Check and award badges based on rules
const evaluateBadges = (userId) => {
  // Collector: Own 10+ games
  const collector = `
    INSERT IGNORE INTO User_Badge (user_id, badge_id)
    SELECT ?, 1
    FROM User_Game
    WHERE user_id = ?
    GROUP BY user_id
    HAVING COUNT(*) >= 10
  `;

  // Pro Gamer: 5 completed games
  const proGamer = `
    INSERT IGNORE INTO User_Badge (user_id, badge_id)
    SELECT ?, 2
    FROM User_Game
    WHERE user_id = ? AND is_completed = TRUE
    GROUP BY user_id
    HAVING COUNT(*) >= 5
  `;

  // Explorer: Played on 3 platforms
  const explorer = `
    INSERT IGNORE INTO User_Badge (user_id, badge_id)
    SELECT ?, 3
    FROM User_Game ug
    JOIN Game_Platform gp ON ug.game_id = gp.game_id
    WHERE ug.user_id = ?
    GROUP BY ug.user_id
    HAVING COUNT(DISTINCT gp.platform_id) >= 3
  `;

  // Achiever: 50 unlocked achievements
  const achiever = `
    INSERT IGNORE INTO User_Badge (user_id, badge_id)
    SELECT ?, 4
    FROM User_Achievement
    WHERE user_id = ?
    GROUP BY user_id
    HAVING COUNT(*) >= 50
  `;

  // Veteran: Account older than 1 year
  const veteran = `
    INSERT IGNORE INTO User_Badge (user_id, badge_id)
    SELECT ?, 5
    FROM User
    WHERE user_id = ?
      AND join_date <= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
  `;

  db.query(collector, [userId, userId]);
  db.query(proGamer, [userId, userId]);
  db.query(explorer, [userId, userId]);
  db.query(achiever, [userId, userId]);
  db.query(veteran, [userId, userId]);
};

module.exports = { evaluateBadges };
