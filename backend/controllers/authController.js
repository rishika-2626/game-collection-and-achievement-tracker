const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ======================================
//  USER SIGNUP
// ======================================
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const q = `
      INSERT INTO User (username, email, password, join_date, total_points)
      VALUES (?, ?, ?, CURDATE(), 0)
    `;

    db.query(q, [username, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err });

      return res.json({
        message: "Signup successful",
        userId: result.insertId,
      });
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// ======================================
//  USER LOGIN
// ======================================
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const q = `SELECT * FROM User WHERE email = ?`;

  db.query(q, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = results[0];

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Incorrect password" });

    return res.json({
      message: "Login successful",
      user: {
        id: user.user_id,
        username: user.username,
        total_points: user.total_points,
      },
    });
  });
};

module.exports = { signup, login };
