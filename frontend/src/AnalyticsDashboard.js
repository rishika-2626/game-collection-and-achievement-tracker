import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./analytics.css";
import { useNavigate } from "react-router-dom";

const AnalyticsDashboard = () => {
  const [pointsOverTime, setPointsOverTime] = useState([]);
  const [completionRateByGenre, setCompletionRateByGenre] = useState([]);
  const [pointsPerMonth, setPointsPerMonth] = useState([]);
  const [commonBadges, setCommonBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Read current logged-in user from localStorage
  const [userId, setUserId] = useState(parseInt(localStorage.getItem("userId")) || 1);

  // ✅ Auto-update if user changes in localStorage (like from Home)
  useEffect(() => {
    const handleStorageChange = () => {
      const newUserId = parseInt(localStorage.getItem("userId")) || 1;
      console.log("🔄 User switched, updating analytics:", newUserId);
      setUserId(newUserId);
      setLoading(true);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log("📊 Fetching analytics for user:", userId);

        const [
          pointsRes,
          completionRes,
          pointsMonthRes,
          badgesRes,
        ] = await Promise.all([
          axios.get(`http://localhost:5001/analytics/${userId}/points-over-time`),
          axios.get(`http://localhost:5001/analytics/${userId}/completion-rate`),
          axios.get(`http://localhost:5001/analytics/${userId}/points-per-month`),
          axios.get(`http://localhost:5001/analytics/common-badges`),
        ]);

        setPointsOverTime(pointsRes.data);
        setCompletionRateByGenre(completionRes.data);
        setPointsPerMonth(pointsMonthRes.data);
        setCommonBadges(badgesRes.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId]);

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your analytics...</p>
      </div>
    );

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">📊 Your Gaming Analytics Dashboard</h1>
      <p className="active-user">Viewing data for: <strong>User #{userId}</strong></p>

      {/* Points Over Time */}
      <div className="chart-section">
        <h2>📈 Points Over Time</h2>
        {pointsOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pointsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date_unlocked" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="points" stroke="#007bff" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available yet.</p>
        )}
      </div>

      {/* Completion Rate by Genre */}
      <div className="chart-section">
        <h2>🎮 Completion Rate by Genre</h2>
        {completionRateByGenre.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionRateByGenre}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="genre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completion_rate" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No completion data available yet.</p>
        )}
      </div>

      {/* Points Earned Per Month */}
      <div className="chart-section">
        <h2>📅 Points Earned Per Month</h2>
        {pointsPerMonth.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pointsPerMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="points_earned" stroke="#f39c12" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No monthly points data available yet.</p>
        )}
      </div>

      {/* Most Common Badges */}
      <div className="chart-section">
        <h2>🏅 Most Common Badges</h2>
        {commonBadges.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commonBadges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_awarded" fill="#ff6384" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No badge data available yet.</p>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default AnalyticsDashboard;
