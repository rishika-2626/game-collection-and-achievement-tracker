import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./gameinfo.css";

const GameInfo = () => {
  const { id } = useParams(); // game_id from URL
  const navigate = useNavigate();

  // States
  const [game, setGame] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [pointsTrend, setPointsTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = 1; // demo user for now

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const [gameRes, achievementsRes, topUsersRes, pointsRes] =
          await Promise.all([
            axios.get(`http://localhost:5001/games/${id}`),
            axios.get(
              `http://localhost:5001/analytics/${userId}/game/${id}/achievements`
            ),
            axios.get(`http://localhost:5001/analytics/game/${id}/top-users`),
            axios.get(
              `http://localhost:5001/analytics/${userId}/game/${id}/points-over-time`
            ),
          ]);

        setGame(gameRes.data);
        setAchievements(achievementsRes.data);
        setTopUsers(topUsersRes.data);
        setPointsTrend(pointsRes.data);
      } catch (err) {
        console.error("❌ Error fetching game data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id, userId]);

  if (loading) return <div className="loading">Loading game details...</div>;
  if (!game) return <div className="error">Game not found.</div>;

  return (
    <div className="game-info-container">
      {/* Header */}
      <div className="game-header">
        <img
          src={game.cover_image || "https://via.placeholder.com/150"}
          alt={game.title}
          className="game-cover"
        />
        <div className="game-details">
          <h1>{game.title}</h1>
          <p>
            <strong>Genre:</strong> {game.genre}
          </p>
          <p>
            <strong>Platform:</strong> {game.platform}
          </p>
          <p>
            <strong>Release Year:</strong> {game.release_year}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="section">
        <h2>📝 Description</h2>
        <p>{game.description || "No description available for this game."}</p>
      </div>

      {/* Achievements */}
      <div className="section">
        <h2>🏆 Achievements</h2>
        {achievements.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Points</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((a, i) => (
                <tr key={i}>
                  <td>{a.title}</td>
                  <td>{a.points}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No achievements available for this game.</p>
        )}
      </div>

      {/* Top Users */}
      <div className="section">
        <h2>🏅 Top Users for {game.title}</h2>
        {topUsers.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Achievements Unlocked</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u, i) => (
                <tr key={i}>
                  <td>{u.username}</td>
                  <td>{u.achievements_unlocked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users have unlocked achievements yet.</p>
        )}
      </div>

      {/* Points Chart */}
      <div className="section chart-section">
        <h2>📈 Points Over Time</h2>
        {pointsTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={pointsTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="points" stroke="#007bff" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No points data available yet.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="actions">
        <button onClick={() => navigate(-1)} className="back-btn">
          ⬅ Back
        </button>
        <button className="complete-btn">✅ Mark as Completed</button>
        <button className="add-ach-btn">➕ Add Achievement</button>
      </div>
    </div>
  );
};

export default GameInfo;
