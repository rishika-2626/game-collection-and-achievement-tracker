import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import GameInfo from "./GameInfo";
import Leaderboard from "./leaderboard";
import AnalyticsDashboard from "./AnalyticsDashboard";
import MyGames from "./MyGames";
import AchievementsDashboard from "./AchievementDashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<GameInfo />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/mygames" element={<MyGames key={Date.now()} />} />
        <Route path="/achievements" element={<AchievementsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
