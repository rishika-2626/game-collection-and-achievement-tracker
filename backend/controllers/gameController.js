const db = require("../config/db");

// Get all games
const getAllGames = (req, res) => {
  const q = `
    SELECT g.game_id, g.title, g.release_year, gen.name AS genre
    FROM Game g
    JOIN Genre gen ON g.genre_id = gen.genre_id;
  `;
  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Get a single game by ID
const getGameById = (req, res) => {
  const gameId = req.params.id;
  const q = `
    SELECT g.title, g.release_year, gen.name AS genre
    FROM Game g
    JOIN Genre gen ON g.genre_id = gen.genre_id
    WHERE g.game_id = ?;
  `;
  db.query(q, [gameId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

module.exports = { getAllGames, getGameById };
