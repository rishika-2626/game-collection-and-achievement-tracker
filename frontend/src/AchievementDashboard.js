import React, { useEffect, useState } from "react";
import axios from "axios";
import "./achievements.css";
import { useNavigate } from "react-router-dom";

const AchievementsDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(parseInt(localStorage.getItem("userId")) || 1);

  const [unlockedCount, setUnlockedCount] = useState(0);
  const [achievementsPerGame, setAchievementsPerGame] = useState([]);
  const [topAchievements, setTopAchievements] = useState([]);
  const [remainingCount, setRemainingCount] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [notEarnedBadges, setNotEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Auto update if user changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newUserId = parseInt(localStorage.getItem("userId")) || 1;
      setUserId(newUserId);
      setLoading(true);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 📦 Fetch all data
  useEffect(() => {
    const fetchAchievementsData = async () => {
      try {
        const [
          unlockedRes,
          perGameRes,
          topRes,
          remainingRes,
          badgesRes,
          notEarnedRes,
        ] = await Promise.all([
          axios.get(`http://localhost:5001/analytics/${userId}/unlocked-achievements`),
          axios.get(`http://localhost:5001/analytics/${userId}/achievements-per-game`),
          axios.get(`http://localhost:5001/analytics/${userId}/top-point-achievements`),
          axios.get(`http://localhost:5001/analytics/${userId}/remaining-achievements`),
          axios.get(`http://localhost:5001/analytics/${userId}/badges`),
          axios.get(`http://localhost:5001/analytics/${userId}/badges-not-earned`),
        ]);

        setUnlockedCount(unlockedRes.data.unlocked_achievements || 0);
        setAchievementsPerGame(perGameRes.data);
        setTopAchievements(topRes.data);
        setRemainingCount(remainingRes.data.remaining_achievements || 0);
        setEarnedBadges(badgesRes.data);
        setNotEarnedBadges(notEarnedRes.data);
      } catch (error) {
        console.error("Error fetching achievements data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievementsData();
  }, [userId]);

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading Achievements & Badges...</p>
      </div>
    );

  return (
    <div className="achievements-container">
      <h1 className="page-title">🏆 Achievements & Badges Overview</h1>
      <p className="active-user">Viewing data for: <strong>User #{userId}</strong></p>

      {/* 1. Achievements Unlocked */}
      <div className="section card-highlight">
        <h2>🎯 Achievements Unlocked</h2>
        <p className="big-number">{unlockedCount}</p>
      </div>

      {/* 2. Achievements per Game */}
      <div className="section">
        <h2>🎮 Achievements per Game</h2>
        {achievementsPerGame.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Game</th>
                <th>Achievement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {achievementsPerGame.map((a, i) => (
                <tr key={i}>
                  <td>{a.game_title}</td>
                  <td>{a.achievement_title}</td>
                  <td>{a.status === "Unlocked" ? "✅ Unlocked" : "🔒 Locked"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No achievements found.</p>
        )}
      </div>

      {/* 3. Top Point Achievements */}
      <div className="section">
        <h2>💪 Top Point Achievements</h2>
        {topAchievements.length > 0 ? (
          <ul className="achievement-list">
            {topAchievements.map((a, i) => (
              <li key={i}>
                <strong>{a.title}</strong> ({a.points} pts) — {a.game_title}
              </li>
            ))}
          </ul>
        ) : (
          <p>No high-point achievements found.</p>
        )}
      </div>

      {/* 4. Achievements Remaining */}
      <div className="section card-highlight warning">
        <h2>🧩 Achievements Remaining</h2>
        <p className="big-number">{remainingCount}</p>
      </div>

      {/* 5. Badges Earned */}
      <div className="section">
        <h2>🏅 Badges Earned</h2>
        {earnedBadges.length > 0 ? (
          <div className="badge-grid">
            {earnedBadges.map((b, i) => (
              <div key={i} className="badge-card">
                <div className="badge-icon">🏅</div>
                <h4>{b.name}</h4>
                <p>{b.description}</p>
                <small>{new Date(b.date_awarded).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        ) : (
          <p>No badges earned yet.</p>
        )}
      </div>

      {/* 6. Badges Not Earned Yet */}
      <div className="section">
        <h2>🚀 Badges Not Earned Yet</h2>
        {notEarnedBadges.length > 0 ? (
          <ul>
            {notEarnedBadges.map((b, i) => (
              <li key={i}>
                <strong>{b.name}</strong> — {b.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>You've earned all badges — impressive! 🏆</p>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default AchievementsDashboard;
