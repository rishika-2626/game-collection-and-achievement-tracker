# Game-Tracker
A Full Stack Gaming Progress & Analytics System
## Overview
Game Tracker is a full-stack web application that helps users manage their game collections, track achievements, earn badges, and analyze gaming progress across platforms.
<br>
The system integrates:
- MySQL (database)
- Node.js + Express (backend APIs)
- React.js (frontend UI)
  <br>
It offers dashboards, analytics, leaderboards, and complete progress-tracking tools for gamers.
---
## Features
### User Features
- Sign Up / Login (bcrypt password hashing)
- View profile, join date, total points
- Switch user profiles (demo mode)

### Game Collection
- Add games to your library
- View game info (genre, platforms, achievements)
- Mark games as completed
- Recently added games list

### Achievements
- Unlock achievements
- Track per-game progress
- Check remaining achievements
- View top point achievements

### Analytics Dashboard
- Points earned over time
- Games completed per month
- Top point achievements
- Genre completion rate
- Platforms most used

### Leaderboard
- Global ranking of users by total points

### Badges
- Earned badges
- Badges not yet earned
  
---
  ## ER Diagram

The system is built on 10 fully normalized tables:
```
User, Game, Genre, Platform, Achievement,
User_Game, User_Achievement,
Badge, User_Badge, Game_Platform
```
Includes many-to-many relationships with associative tables.
<img width="906" height="727" alt="Screenshot 2025-11-06 at 4 15 36 PM" src="https://github.com/user-attachments/assets/0d8139c9-3141-4bc0-b09c-3cf34758fb12" />

---


## Database Design
### 3NF Normalized Tables
- No repeating groups
- No partial dependencies
- No transitive dependencies

### Sample Schema Highlights
- User(user_id, username, email, password, join_date)
- Game(game_id, title, release_year, genre_id)
- Achievement(achievement_id, game_id, title, points)
- User_Game(user_id, game_id, date_added, is_completed)
- User_Achievement(user_id, achievement_id, date_unlocked)

### Constraints include:
- UNIQUE (username, email)
- NOT NULL enforced
- CHECK (valid release year, non-negative points)
- DEFAULT values for timestamps & booleans
  
---
## Tech Stack
### Frontend
- React.js
- Axios
- Recharts (charts & analytics)
- Custom CSS

### Backend
- Node.js
- Express.js
- MySQL database
- bcrypt.js for password hashing

### Database
- MySQL Workbench 8.0 CE

### Development Environment
- VS Code
- macOS / Windows

---

## Running the Project
**1. Clone the Repository**
```
git clone https://github.com/rishika-2626/game-collection-and-achievement-tracker.git
cd game-collection-and-achievement-tracker
```
**How to Import the Database**
**Using MySQL Workbench (Recommended)**
- Open MySQL Workbench
- Connect to your MySQL server
- Go to File → Open SQL Script
- Select database.sql
- Click Execute (⚡)
  <br>
This will automatically create:
- The database: game_tracker_db
- All tables (User, Game, Genre, Achievement, etc.)
- All sample data for testing
  
**Connecting Backend to Database**
Inside the backend (config/db.js), configure:
```
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "game_tracker_db",
});

```
**2. Setup Backend**
```
cd backend
npm install
```
```
npm start
```
**3. Setup Frontend**
```
cd frontend
npm install
npm start

```
---

## Screenshots
*Home Page*
<img width="1203" height="1657" alt="SCR-20251119-tbbk" src="https://github.com/user-attachments/assets/98e3d2a7-c2ee-40d3-8d25-0eb6f7fa59e1" />
*Analytics Dashboard*
<img width="2408" height="4443" alt="SCR-20251119-tccr" src="https://github.com/user-attachments/assets/a3c41e07-8748-440c-b644-da58b0dc336e" />

---
## Conclusion
## Game Tracker delivers:
- A fully interactive, analytics-powered gaming dashboard
- A complete normalized database
- A functional full-stack application
## Future Enhancements
- Mobile app
- Friend system & social interactions
- ML-powered recommendations
- Notifications & game suggestions
---
## References
- https://dev.mysql.com
- https://expressjs.com
- https://react.dev

