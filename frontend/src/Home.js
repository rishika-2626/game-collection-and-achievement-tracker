import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [recentGames, setRecentGames] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = 1; // Later replace this with logged-in user's ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [userRes, pointsRes, gamesRes, completedRes, achievementsRes, recentGamesRes, achievementsListRes] =
          await Promise.all([
            axios.get(`http://localhost:5001/users/${userId}`),
            axios.get(`http://localhost:5001/analytics/${userId}/total-points`),
            axios.get(`http://localhost:5001/analytics/${userId}/total-games`),
            axios.get(`http://localhost:5001/analytics/${userId}/completed-games`),
            axios.get(`http://localhost:5001/analytics/${userId}/unlocked-achievements`),
            axios.get(`http://localhost:5001/analytics/${userId}/recent-games`),
            axios.get(`http://localhost:5001/users/${userId}/achievements`)
          ]);

        setUser(userRes.data);
        setStats({
          totalPoints: pointsRes.data.total_points,
          totalGames: gamesRes.data.total_games,
          completedGames: completedRes.data.completed_games,
          unlockedAchievements: achievementsRes.data.unlocked_achievements,
        });
        setRecentGames(recentGamesRes.data);
        setRecentAchievements(achievementsListRes.data.slice(0, 5)); // limit to 5
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home-container">
      {/* Profile Section */}
      <div className="profile-section">
        <img
          src="https://via.placeholder.com/80"
          alt="User Avatar"
          className="avatar"
        />
        <div className="user-info">
          <h2>{user.username}</h2>
          <p>Joined: {new Date(user.join_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
          <p className="points">⭐ {stats.totalPoints} Points</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="card">
          <h3>Total Points</h3>
          <p>{stats.totalPoints}</p>
        </div>
        <div className="card">
          <h3>Games Collected</h3>
          <p>{stats.totalGames}</p>
        </div>
        <div className="card">
          <h3>Completed Games</h3>
          <p>{stats.completedGames}</p>
        </div>
        <div className="card">
          <h3>Achievements Unlocked</h3>
          <p>{stats.unlockedAchievements}</p>
        </div>
      </div>

      {/* Recent Games Section */}
      <div className="section">
        <h2>🎮 Recent Games</h2>
        <ul>
          {recentGames.length > 0 ? (
            recentGames.map((game, index) => (
              <li key={index}>
                <strong>{game.title}</strong> – Added on {new Date(game.date_added).toLocaleDateString()}
              </li>
            ))
          ) : (
            <p>No recent games found.</p>
          )}
        </ul>
      </div>

      {/* Recent Achievements Section */}
      <div className="section">
        <h2>🏆 Recent Achievements</h2>
        <ul>
          {recentAchievements.length > 0 ? (
            recentAchievements.map((a, index) => (
              <li key={index}>
                <strong>{a.title}</strong> – {a.game_title} ({a.points} pts)
              </li>
            ))
          ) : (
            <p>No achievements yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
