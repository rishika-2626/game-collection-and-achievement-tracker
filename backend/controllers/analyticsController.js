const db = require("../config/db");

// 1. Total Points (User)
const getUserTotalPoints = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT u.username, u.total_points
    FROM User u
    WHERE u.user_id = ?;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};

// 2. Number of Games Collected
const getUserTotalGames = (req, res) => {
  const userId = req.params.id;
  const q = `SELECT COUNT(*) AS total_games FROM User_Game WHERE user_id = ?;`;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};


// 3. Completed Games
const getUserCompletedGames = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT COUNT(*) AS completed_games
    FROM User_Game
    WHERE user_id = ? AND is_completed = TRUE;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};


// 4. Achievements Unlocked
const getUserUnlockedAchievements = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT COUNT(*) AS unlocked_achievements
    FROM User_Achievement
    WHERE user_id = ?;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};


// 5. Badges Earned
const getUserBadges = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT b.name, b.description, ub.date_awarded
    FROM User_Badge ub
    JOIN Badge b ON ub.badge_id = b.badge_id
    WHERE ub.user_id = ?;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 6. User Game List
const getUserGamesList = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT g.title, g.release_year, gen.name AS genre, ug.is_completed
    FROM User_Game ug
    JOIN Game g ON ug.game_id = g.game_id
    JOIN Genre gen ON g.genre_id = gen.genre_id
    WHERE ug.user_id = ?;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 7. Achievements per Game
const getAchievementsPerGame = (req, res) => {
 const { userId, gameId } = req.params;
  const q = `
    SELECT 
      a.achievement_id,
      a.title,
      a.points,
      CASE 
        WHEN ua.user_id IS NOT NULL THEN 'Unlocked'
        ELSE 'Locked'
      END AS status
    FROM Achievement a
    LEFT JOIN User_Achievement ua 
      ON a.achievement_id = ua.achievement_id AND ua.user_id = ?
    WHERE a.game_id = ?;
  `;

  db.query(q, [userId, gameId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 8. Top Games by Points
const getTopGamesByPoints = (req, res) => {
  const q = `
    SELECT g.title, SUM(a.points) AS total_points
    FROM Game g
    JOIN Achievement a ON g.game_id = a.game_id
    GROUP BY g.title
    ORDER BY total_points DESC
    LIMIT 5;
  `;
  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};



// 9. Points Over Time
const getPointsOverTime = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT ua.date_unlocked, SUM(a.points) AS points
    FROM User_Achievement ua
    JOIN Achievement a ON ua.achievement_id = a.achievement_id
    WHERE ua.user_id = ?
    GROUP BY ua.date_unlocked
    ORDER BY ua.date_unlocked;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 10. Completion Rate by Genre
const getCompletionRateByGenre = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT gen.name AS genre,
           ROUND(SUM(CASE WHEN ug.is_completed THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS completion_rate
    FROM User_Game ug
    JOIN Game g ON ug.game_id = g.game_id
    JOIN Genre gen ON g.genre_id = gen.genre_id
    WHERE ug.user_id = ?
    GROUP BY gen.name;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 11. Leaderboard
const getLeaderboard = (req, res) => {
  const q = `
    SELECT username, total_points
    FROM User
    ORDER BY total_points DESC
    LIMIT 10;
  `;
  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 12. Top Achievers per Game
const getTopAchieversPerGame = (req, res) => {
  const gameId = req.params.gameId;
  const q = `
    SELECT u.username, COUNT(ua.achievement_id) AS achievements_unlocked
    FROM User u
    JOIN User_Achievement ua ON u.user_id = ua.user_id
    JOIN Achievement a ON ua.achievement_id = a.achievement_id
    WHERE a.game_id = ?
    GROUP BY u.user_id
    ORDER BY achievements_unlocked DESC
    LIMIT 5;
  `;
  db.query(q, [gameId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 13. Most Played Genre
const getMostPlayedGenre = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT gen.name AS genre, COUNT(*) AS total_games
    FROM User_Game ug
    JOIN Game g ON ug.game_id = g.game_id
    JOIN Genre gen ON g.genre_id = gen.genre_id
    WHERE ug.user_id = ?
    GROUP BY gen.name
    ORDER BY total_games DESC
    LIMIT 1;
  `;
  db.query(q, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};


// 14. Recently Added Games
const getRecentGames = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT g.game_id, g.title, ug.date_added
    FROM User_Game ug
    JOIN Game g ON ug.game_id = g.game_id
    WHERE ug.user_id = ?
    ORDER BY ug.date_added DESC
    LIMIT 5;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};




// 15. Top Point Achievements
const getTopPointAchievements = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT a.title, a.points, g.title AS game_title
    FROM User_Achievement ua
    JOIN Achievement a ON ua.achievement_id = a.achievement_id
    JOIN Game g ON a.game_id = g.game_id
    WHERE ua.user_id = ?
    ORDER BY a.points DESC
    LIMIT 5;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};



// 16. Achievements Remaining
const getRemainingAchievements = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT COUNT(*) AS remaining_achievements
    FROM Achievement a
    LEFT JOIN User_Achievement ua 
           ON a.achievement_id = ua.achievement_id AND ua.user_id = ?
    WHERE ua.achievement_id IS NULL;
  `;
  db.query(q, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};



// 17. Platforms Most Used
const getPlatformsMostUsed = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT p.name AS platform, COUNT(*) AS total_games
    FROM User_Game ug
    JOIN Game_Platform gp ON ug.game_id = gp.game_id
    JOIN Platform p ON gp.platform_id = p.platform_id
    WHERE ug.user_id = ?
    GROUP BY p.name
    ORDER BY total_games DESC;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 18. Games Completed Per Month
const getGamesCompletedPerMonth = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT MONTHNAME(completion_date) AS month, COUNT(*) AS games_completed
    FROM User_Game
    WHERE user_id = ? AND is_completed = TRUE
    GROUP BY MONTH(completion_date), MONTHNAME(completion_date)
    ORDER BY MONTH(completion_date);
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 19. Points Earned Per Month
const getPointsEarnedPerMonth = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT MONTHNAME(ua.date_unlocked) AS month, SUM(a.points) AS points_earned
    FROM User_Achievement ua
    JOIN Achievement a ON ua.achievement_id = a.achievement_id
    WHERE ua.user_id = ?
    GROUP BY MONTH(ua.date_unlocked), MONTHNAME(ua.date_unlocked)
    ORDER BY MONTH(ua.date_unlocked);
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 20. Players Ahead
const getPlayersAhead = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT username, total_points
    FROM User
    WHERE total_points > (SELECT total_points FROM User WHERE user_id = ?)
    ORDER BY total_points ASC
    LIMIT 5;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 21. Most Common Badges
const getMostCommonBadges = (req, res) => {
  const q = `
    SELECT b.name, COUNT(ub.user_id) AS total_awarded
    FROM User_Badge ub
    JOIN Badge b ON ub.badge_id = b.badge_id
    GROUP BY b.name
    ORDER BY total_awarded DESC;
  `;
  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 22. Badges Not Earned Yet
const getBadgesNotEarned = (req, res) => {
  const userId = req.params.id;
  const q = `
    SELECT b.name, b.description
    FROM Badge b
    LEFT JOIN User_Badge ub 
           ON b.badge_id = ub.badge_id AND ub.user_id = ?
    WHERE ub.badge_id IS NULL;
  `;
  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// -----------------------------
// 🎮 GAME INFO PAGE CONTROLLERS
// -----------------------------




// 23. ✅ Get Game Details by ID
const getGameById = (req, res) => {
  const gameId = req.params.gameId;
  const q = `
    SELECT 
      g.game_id, 
      g.title, 
      g.release_year, 
      gen.name AS genre,
      GROUP_CONCAT(DISTINCT p.name SEPARATOR ', ') AS platforms
    FROM Game g
    JOIN Genre gen ON g.genre_id = gen.genre_id
    LEFT JOIN Game_Platform gp ON g.game_id = gp.game_id
    LEFT JOIN Platform p ON gp.platform_id = p.platform_id
    WHERE g.game_id = ?
    GROUP BY g.game_id, g.title, g.release_year, gen.name;
  `;
  db.query(q, [gameId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Game not found" });
    res.json(result[0]);
  });
};


// 24. ✅ Get All Achievements for a Game (with user's unlock status)
const getAchievementsForGame = (req, res) => {
  const { userId, gameId } = req.params;
  const q = `
    SELECT 
      a.achievement_id, 
      a.title AS achievement_title, 
      a.description, 
      a.points,
      CASE WHEN ua.achievement_id IS NULL THEN 'Locked' ELSE 'Unlocked' END AS status
    FROM Achievement a
    LEFT JOIN User_Achievement ua 
      ON a.achievement_id = ua.achievement_id AND ua.user_id = ?
    WHERE a.game_id = ?
    ORDER BY a.points DESC;
  `;
  db.query(q, [userId, gameId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 25. ✅ Get Top Users for a Specific Game
const getTopUsersForGame = (req, res) => {
  const gameId = req.params.gameId;
  const q = `
    SELECT 
      u.username, 
      COUNT(ua.achievement_id) AS achievements_unlocked
    FROM User u
    JOIN User_Achievement ua ON u.user_id = ua.user_id
    JOIN Achievement a ON ua.achievement_id = a.achievement_id
    WHERE a.game_id = ?
    GROUP BY u.user_id, u.username
    ORDER BY achievements_unlocked DESC
    LIMIT 5;
  `;
  db.query(q, [gameId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// 26. ✅ Points from this Game Over Time (for Line Chart)
const getGamePointsOverTime = (req, res) => {
  const { userId, gameId } = req.params;
  const q = `
    SELECT 
      ua.date_unlocked AS date, 
      SUM(a.points) AS total_points
    FROM User_Achievement ua
    JOIN Achievement a ON ua.achievement_id = a.achievement_id
    WHERE ua.user_id = ? AND a.game_id = ?
    GROUP BY ua.date_unlocked
    ORDER BY ua.date_unlocked;
  `;
  db.query(q, [userId, gameId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// // 27. ✅ Game Completion Rate Among All Users (for Bar Chart)
// const getGameCompletionRate = (req, res) => {
//   const gameId = req.params.gameId;
//   console.log("➡️ Received request for gameId:", gameId); // ✅ Add this

//   const q = `
//     SELECT 
//         COALESCE(CONCAT(MONTHNAME(ug.completion_date), ' ', YEAR(ug.completion_date)), 'N/A') AS month,
//         ROUND(SUM(CASE WHEN ug.is_completed = TRUE THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100, 2) AS completion_rate
//     FROM User_Game ug
//     WHERE ug.game_id = ?
//       AND ug.completion_date IS NOT NULL
//     GROUP BY YEAR(ug.completion_date), MONTH(ug.completion_date)
//     ORDER BY YEAR(ug.completion_date), MONTH(ug.completion_date);
//   `;

//   db.query(q, [gameId], (err, results) => {
//     if (err) {
//       console.error("❌ Error in getGameCompletionRate:", err); // ✅ Log error
//       return res.status(500).json({ message: "Database error", error: err });
//     }
//     res.json(results);
//   });
// };







module.exports = {
  getUserTotalPoints,
  getUserTotalGames,
  getUserCompletedGames,
  getUserUnlockedAchievements,
  getUserBadges,
  getUserGamesList,
  getAchievementsPerGame,
  getTopGamesByPoints,
  getPointsOverTime,
  getCompletionRateByGenre,
  getLeaderboard,
  getTopAchieversPerGame,
  getMostPlayedGenre,
  getRecentGames,
  getTopPointAchievements,
  getRemainingAchievements,
  getPlatformsMostUsed,
  getGamesCompletedPerMonth,
  getPointsEarnedPerMonth,
  getPlayersAhead,
  getMostCommonBadges,
  getBadgesNotEarned,
  getGameById,
  getAchievementsForGame,
  getTopUsersForGame,
  getGamePointsOverTime,
  //getGameCompletionRate,
};

