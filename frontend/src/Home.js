import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [recentGames, setRecentGames] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGameId, setNewGameId] = useState("");
  const [availableGames, setAvailableGames] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem("userId") || 1);

  const fetchData = async (userId) => {
    try {
      const [
        userRes,
        pointsRes,
        gamesRes,
        completedRes,
        achievementsRes,
        recentGamesRes,
        achievementsListRes,
      ] = await Promise.all([
        axios.get(`http://localhost:5001/users/${userId}`),
        axios.get(`http://localhost:5001/analytics/${userId}/total-points`),
        axios.get(`http://localhost:5001/analytics/${userId}/total-games`),
        axios.get(`http://localhost:5001/analytics/${userId}/completed-games`),
        axios.get(`http://localhost:5001/analytics/${userId}/unlocked-achievements`),
        axios.get(`http://localhost:5001/analytics/${userId}/recent-games`),
        axios.get(`http://localhost:5001/users/${userId}/achievements`),
      ]);

      setUser(userRes.data);
      setStats({
        totalPoints: pointsRes.data.total_points,
        totalGames: gamesRes.data.total_games,
        completedGames: completedRes.data.completed_games,
        unlockedAchievements: achievementsRes.data.unlocked_achievements,
      });
      setRecentGames(recentGamesRes.data);
      setRecentAchievements(achievementsListRes.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableGames = async () => {
    try {
      const res = await axios.get("http://localhost:5001/games");
      setAvailableGames(res.data);
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("userId", currentUserId);
    fetchData(currentUserId);
    fetchAvailableGames();
  }, [currentUserId]);

  const handleUserChange = (e) => {
    const newId = e.target.value;
    console.log("🆕 Switching to user:", newId);
    setCurrentUserId(newId);
    localStorage.setItem("userId", newId);
    setLoading(true);
    fetchData(newId);
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    if (!newGameId) return alert("Please select a game!");

    try {
      await axios.post(`http://localhost:5001/users/${currentUserId}/games`, {
        game_id: newGameId,
      });
      alert("Game added successfully!");
      setShowModal(false);
      setNewGameId("");
      fetchData(currentUserId);
    } catch (err) {
      console.error("Error adding game:", err);
      alert("Error adding game. Check console for details.");
    }
  };

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your gaming stats...</p>
      </div>
    );

  return (
    <div className="home-container">
     

      {/* Header with Title and User Switcher */}
      <div className="header">
        <h1 className="dashboard-title">🎮 Game Tracker</h1>
        <div className="user-switcher">
          <label htmlFor="userSelect">👤 View as:</label>
          <select id="userSelect" value={currentUserId} onChange={handleUserChange}>
            <option value="1">Mahathi</option>
            <option value="2">Arjun</option>
            <option value="3">Sneha</option>
            <option value="4">Ravi</option>
            <option value="5">Meera</option>
            <option value="6">Kiran</option>
            <option value="7">Tanya</option>
            <option value="8">Vijay</option>
          </select>
        </div>
      </div>

      {/* Merged Profile + Quick Links Section */}
      <div className="profile-header">
        <div className="profile-left">
          <img
            src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.username}`}
            alt="User Avatar"
            className="avatar"
          />
          <div className="user-info">
            <h2>{user.username}</h2>
            <p>
              🎮 Joined:{" "}
              {new Date(user.join_date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="points">⭐ {stats.totalPoints} Points</p>
          </div>
        </div>

        <div className="profile-links">
          <Link to="/leaderboard" className="leaderboard-link">🏆 Leaderboard</Link>
          <Link to="/mygames" className="mygames-link">🎮 My Games</Link>
          <Link to="/analytics" className="analytics-link">📊 Analytics</Link>
          <Link to="/achievements" className="achievements-link">🏅 Achievements</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        {[
          { title: "Total Points", value: stats.totalPoints, color: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" },
          { title: "Games Collected", value: stats.totalGames, color: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)" },
          { title: "Completed Games", value: stats.completedGames, color: "linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)" },
          { title: "Achievements", value: stats.unlockedAchievements, color: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
        ].map((stat, index) => (
          <div className="card" key={index} style={{ background: stat.color }}>
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Games */}
      <div className="section">
        <h2>🎮 Recent Games</h2>
        <ul>
          {recentGames.length > 0 ? (
            recentGames.map((game, index) => (
              <li key={index}>
                <Link to={`/game/${game.game_id}`} className="game-link">
                  <strong>{game.title}</strong>
                </Link>{" "}
                – Added on {new Date(game.date_added).toLocaleDateString()}
              </li>
            ))
          ) : (
            <p>No recent games found.</p>
          )}
        </ul>
      </div>

      {/* Recent Achievements */}
      <div className="section fade-in">
        <h2>🏆 Recent Achievements</h2>
        {recentAchievements.length > 0 ? (
          <ul>
            {recentAchievements.map((a, i) => (
              <li key={i} className="achievement-item">
                <strong>{a.title}</strong>
                <span> – {a.game_title} ({a.points} pts)</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No achievements unlocked yet.</p>
        )}
      </div>

      {/* Floating Add Game Button */}
      <button className="add-game-btn" onClick={() => setShowModal(true)}>
        ➕
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add a New Game</h2>
            <form onSubmit={handleAddGame}>
              <label>Select Game</label>
              <select value={newGameId} onChange={(e) => setNewGameId(e.target.value)}>
                <option value="">-- Choose a game --</option>
                {availableGames.map((game) => (
                  <option key={game.game_id} value={game.game_id}>
                    {game.title}
                  </option>
                ))}
              </select>
              <button type="submit" className="submit-btn">Add Game</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
