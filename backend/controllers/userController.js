const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { evaluateBadges } = require("./badgeController");

// -------------------- CREATE --------------------

// ✅ Register new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const q = `
      INSERT INTO User (username, email, password, join_date, total_points)
      VALUES (?, ?, ?, CURDATE(), 0)
    `;

    db.query(q, [username, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.json({ message: "User registered successfully", userId: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// -------------------- LOGIN --------------------

const loginUser = (req, res) => {
  const { email, password } = req.body;

  const q = `SELECT * FROM User WHERE email = ?`;

  db.query(q, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = results[0];
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) return res.status(401).json({ message: "Invalid password" });

    res.json({
      message: "Login successful",
      user: { id: user.user_id, username: user.username, total_points: user.total_points },
    });
  });
};

// -------------------- READ --------------------

// ✅ Get user details
const getUserById = (req, res) => {
  const userId = req.params.id;

  const q = `SELECT user_id, username, email, join_date, total_points FROM User WHERE user_id = ?`;

  db.query(q, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// ✅ Get user's game collection
const getUserGames = (req, res) => {
  const userId = req.params.id;

  const q = `
    SELECT g.game_id, g.title, g.release_year, gen.name AS genre, 
           ug.is_completed, ug.date_added
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

// ✅ Get user's achievements
const getUserAchievements = (req, res) => {
  const userId = req.params.id;

  const q = `
    SELECT a.title, a.description, a.points, g.title AS game_title, ua.date_unlocked
    FROM User_Achievement ua
    JOIN Achievement a ON ua.achievement_id = a.achievement_id
    JOIN Game g ON a.game_id = g.game_id
    WHERE ua.user_id = ?;
  `;

  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// ✅ Get user's badges
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

// -------------------- UPDATE --------------------

// ✅ Mark game as completed (auto-add if missing)
const markGameCompleted = (req, res) => {
  const { id, gameId } = req.params;

  const checkQuery = `
      SELECT * FROM User_Game 
      WHERE user_id = ? AND game_id = ?
  `;

  db.query(checkQuery, [id, gameId], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    // If NOT in collection → insert then evaluate badges
    if (result.length === 0) {
      const insertQuery = `
        INSERT INTO User_Game (user_id, game_id, date_added, is_completed, completion_date)
        VALUES (?, ?, CURDATE(), TRUE, CURDATE());
      `;

      db.query(insertQuery, [id, gameId], (insertErr) => {
        if (insertErr) return res.status(500).json({ error: insertErr });

        evaluateBadges(id); // ⭐ Badge check

        return res.json({
          message: "Game added & marked as completed!",
          status: "added_completed",
        });
      });
    } else {
      const updateQuery = `
        UPDATE User_Game
        SET is_completed = TRUE, completion_date = CURDATE()
        WHERE user_id = ? AND game_id = ?
      `;

      db.query(updateQuery, [id, gameId], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr });

        evaluateBadges(id); // ⭐ Badge check

        return res.json({
          message: "Game marked as completed!",
          status: "updated_completed",
        });
      });
    }
  });
};

// -------------------- DELETE --------------------

// ✅ Remove game from collection
const deleteUserGame = (req, res) => {
  const { id, gameId } = req.params;

  const q = `DELETE FROM User_Game WHERE user_id = ? AND game_id = ?`;

  db.query(q, [id, gameId], (err) => {
    if (err) return res.status(500).json(err);

    evaluateBadges(id); // ⭐ Might change "Collector" or "Explorer"

    res.json({ message: "Game removed successfully" });
  });
};

// -------------------- ADD RELATIONS --------------------

// ✅ Add game to user library
const addUserGame = (req, res) => {
  const userId = req.params.id;
  const { game_id } = req.body;

  const q = `
    INSERT IGNORE INTO User_Game (user_id, game_id, date_added, is_completed)
    VALUES (?, ?, CURDATE(), FALSE);
  `;

  db.query(q, [userId, game_id], (err) => {
    if (err) return res.status(500).json(err);

    evaluateBadges(userId); // ⭐ Badge check

    res.json({ message: "Game added to collection!" });
  });
};

// ✅ Unlock achievement
const unlockAchievement = (req, res) => {
  const userId = req.params.id;
  const { achievement_id } = req.body;

  if (!achievement_id)
    return res.status(400).json({ message: "Achievement ID required" });

  const q = `
    INSERT IGNORE INTO User_Achievement (user_id, achievement_id, date_unlocked)
    VALUES (?, ?, CURDATE());
  `;

  db.query(q, [userId, achievement_id], (err) => {
    if (err) return res.status(500).json(err);

    evaluateBadges(userId); // ⭐ Badge check

    res.json({ message: "Achievement unlocked!" });
  });
};

module.exports = {
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
};
