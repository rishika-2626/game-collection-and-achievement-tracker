import React, { useEffect, useState } from "react";
import axios from "axios";
import "./leaderboard.css";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5001/analytics/leaderboard");
        setLeaders(res.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading leaderboard...</p>
      </div>
    );

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">🏆 Global Leaderboard</h1>
      <p className="leaderboard-subtitle">
        See who’s dominating the gaming world!
      </p>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((player, index) => (
            <tr
              key={index}
              className={
                index === 0
                  ? "gold"
                  : index === 1
                  ? "silver"
                  : index === 2
                  ? "bronze"
                  : ""
              }
            >
              <td>#{index + 1}</td>
              <td>{player.username}</td>
              <td>{player.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default Leaderboard;
