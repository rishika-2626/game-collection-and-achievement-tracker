import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./mygames.css";

const MyGames = () => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || 1);
  const [games, setGames] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [recentGames, setRecentGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [gamesPerMonth, setGamesPerMonth] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data for selected user
  useEffect(() => {
    console.log("📦 Loaded userId from localStorage:", userId);
    const fetchAll = async () => {
      try {
        const [
          gamesRes,
          completedRes,
          recentRes,
          topGamesRes,
          monthlyRes,
        ] = await Promise.all([
          axios.get(`http://localhost:5001/analytics/${userId}/games-list`),
          axios.get(`http://localhost:5001/analytics/${userId}/completed-games`),
          axios.get(`http://localhost:5001/analytics/${userId}/recent-games`),
          axios.get(`http://localhost:5001/analytics/top-games`),
          axios.get(`http://localhost:5001/analytics/${userId}/games-per-month`),
        ]);

        setGames(gamesRes.data);
        setCompletedCount(completedRes.data.completed_games);
        setRecentGames(recentRes.data);
        setTopGames(topGamesRes.data);
        setGamesPerMonth(monthlyRes.data);
      } catch (err) {
        console.error("Error fetching MyGames data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  // Automatically update user when switched on Home
  useEffect(() => {
    const handleStorageChange = () => {
      const newUserId = localStorage.getItem("userId") || 1;
      setUserId(newUserId);
      setLoading(true);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading) return <div className="loading">Loading your games...</div>;

  return (
    <div className="mygames-container">
      <h1 className="page-title">🎮 My Games Dashboard</h1>
      <p className="active-user">Viewing data for: <strong>User #{userId}</strong></p>

      {/* User Game List */}
      <div className="section">
        <h2>📋 Your Game Collection</h2>
        {games.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g, i) => (
                <tr key={i}>
                  <td>{g.title}</td>
                  <td>{g.genre}</td>
                  <td>{g.release_year}</td>
                  <td>{g.is_completed ? "✅ Completed" : "🕹️ In Progress"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No games found in your collection.</p>
        )}
      </div>

      {/* Completed Games Progress */}
      <div className="section">
        <h2>🏁 Completed Games</h2>
        <p className="progress-count">
          You’ve completed <strong>{completedCount}</strong> games so far! 🎉
        </p>
      </div>

      {/* Recently Added Games */}
      <div className="section">
        <h2>🕒 Recently Added Games</h2>
        {recentGames.length > 0 ? (
          <ul>
            {recentGames.map((g, i) => (
              <li key={i}>
                <strong>{g.title}</strong> — added on{" "}
                {new Date(g.date_added).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recently added games.</p>
        )}
      </div>

      {/* Top Games by Points */}
      <div className="section">
        <h2>🏆 Top Games by Points</h2>
        {topGames.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Game</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {topGames.map((g, i) => (
                <tr key={i}>
                  <td>{g.title}</td>
                  <td>{g.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No point data available.</p>
        )}
      </div>

      {/* Games Completed Per Month */}
      <div className="section">
        <h2>📅 Games Completed Per Month</h2>
        {gamesPerMonth.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={gamesPerMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="games_completed" stroke="#007bff" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No completion data yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyGames;
