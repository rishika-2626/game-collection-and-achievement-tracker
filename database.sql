-- -----------------------------------------------------
-- 🎮 GAME TRACKER DATABASE (FINAL MERGED VERSION)
-- -----------------------------------------------------

DROP DATABASE IF EXISTS game_tracker_db;
CREATE DATABASE game_tracker_db;
USE game_tracker_db;

-- -----------------------------------------------------
-- TABLES
-- -----------------------------------------------------

CREATE TABLE User (
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email LIKE '%@%.%'),
    password VARCHAR(255) NOT NULL,
    join_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    total_points INT UNSIGNED DEFAULT 0 CHECK (total_points >= 0)
);

CREATE TABLE Genre (
    genre_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Platform (
    platform_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Game (
    game_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    genre_id INT UNSIGNED NOT NULL,
    release_year YEAR NOT NULL CHECK (release_year >= 1980),
    FOREIGN KEY (genre_id) REFERENCES Genre(genre_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE Game_Platform (
    game_id INT UNSIGNED NOT NULL,
    platform_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (game_id, platform_id),
    FOREIGN KEY (game_id) REFERENCES Game(game_id)
        ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES Platform(platform_id)
        ON DELETE CASCADE
);

CREATE TABLE Achievement (
    achievement_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    game_id INT UNSIGNED NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    points INT UNSIGNED DEFAULT 0 CHECK (points >= 0),
    FOREIGN KEY (game_id) REFERENCES Game(game_id)
        ON DELETE CASCADE
);

CREATE TABLE Badge (
    badge_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    criteria VARCHAR(255)
);

CREATE TABLE User_Game (
    user_id INT UNSIGNED NOT NULL,
    game_id INT UNSIGNED NOT NULL,
    date_added DATE NOT NULL DEFAULT (CURRENT_DATE),
    is_completed BOOLEAN DEFAULT FALSE,
    completion_date DATE NULL,
    PRIMARY KEY (user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES Game(game_id)
        ON DELETE CASCADE
);

CREATE TABLE User_Achievement (
    user_id INT UNSIGNED NOT NULL,
    achievement_id INT UNSIGNED NOT NULL,
    date_unlocked DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES Achievement(achievement_id)
        ON DELETE CASCADE
);

CREATE TABLE User_Badge (
    user_id INT UNSIGNED NOT NULL,
    badge_id INT UNSIGNED NOT NULL,
    date_awarded DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES Badge(badge_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_game_title ON Game(title);
CREATE INDEX idx_achievement_game ON Achievement(game_id);
CREATE INDEX idx_user_game_completed ON User_Game(is_completed);

-- -----------------------------------------------------
-- INSERT MAIN DATA
-- -----------------------------------------------------

INSERT INTO User (user_id, username, email, password, join_date, total_points) VALUES
(1, 'mahathi', 'mahathi@example.com', 'pass123', '2024-01-10', 1500),
(2, 'arjun', 'arjun@example.com', 'pass234', '2024-02-15', 1200),
(3, 'sneha', 'sneha@example.com', 'pass345', '2024-03-05', 900),
(4, 'ravi', 'ravi@example.com', 'pass456', '2024-04-12', 1700),
(5, 'meera', 'meera@example.com', 'pass567', '2024-05-20', 1100),
(6, 'kiran', 'kiran@example.com', 'pass678', '2024-06-18', 800),
(7, 'tanya', 'tanya@example.com', 'pass789', '2024-07-01', 950),
(8, 'vijay', 'vijay@example.com', 'pass890', '2024-07-25', 1300);

-- GENRES
INSERT INTO Genre (genre_id, name) VALUES
(1,'Action'),
(2,'Sports'),
(3,'Adventure'),
(4,'RPG'),
(5,'Strategy'),
(6,'Shooter'),
(7,'Puzzle');

-- PLATFORMS
INSERT INTO Platform (platform_id, name) VALUES
(1,'PC'),
(2,'PlayStation'),
(3,'Xbox'),
(4,'Nintendo Switch'),
(5,'Mobile'),
(6,'VR');

-- -----------------------------------------------------
-- GAMES (original 10 + new 8)
-- -----------------------------------------------------

INSERT INTO Game (game_id, title, genre_id, release_year) VALUES
(1,'GTA V',1,2015),
(2,'FIFA 24',2,2024),
(3,'Assassin Creed',3,2018),
(4,'Valorant',1,2020),
(5,'Need for Speed',2,2019),
(6,'Minecraft',3,2011),
(7,'Call of Duty',1,2022),
(8,'Rocket League',2,2020),
(9,'Tomb Raider',3,2019),
(10,'PUBG',1,2018),

-- Newly added:
(11,'Zelda: Breath of the Wild',4,2017),
(12,'Clash Royale',5,2016),
(13,'Elden Ring',4,2022),
(14,'Halo Infinite',6,2021),
(15,'Candy Crush',7,2014),
(16,'Among Us',5,2018),
(17,'Fortnite',6,2017),
(18,'Super Mario Odyssey',4,2017);

-- -----------------------------------------------------
-- GAME PLATFORM MAPPING
-- -----------------------------------------------------

INSERT INTO Game_Platform VALUES
(1,1),(1,2),
(2,2),(2,3),
(3,1),(3,2),
(4,1),
(5,1),(5,3),
(6,1),
(7,2),(7,3),
(8,1),(8,3),
(9,2),
(10,1),(10,3),

-- New:
(11,4),(11,1),
(12,5),
(13,1),(13,4),
(14,3),(14,1),
(15,5),
(16,1),(16,5),
(17,1),(17,3),
(18,4);

-- -----------------------------------------------------
-- ACHIEVEMENTS (original + expanded)
-- -----------------------------------------------------

-- (IDs auto-increment; we insert in correct order)
INSERT INTO Achievement (game_id,title,description,points) VALUES
(1,'First Heist','Complete your first mission',100),
(1,'Millionaire','Earn $1 million',200),
(1,'Street Racer','Win 5 street races',120),
(1,'Most Wanted','Survive a 5-star police chase',180),
(1,'Treasure Hunter','Find 30 hidden packages',150),

(2,'Hat-trick Hero','Score 3 goals in a match',150),
(2,'Clean Sheet Master','Win 10 matches without conceding',120),
(2,'Ultimate Champion','Win an online tournament',200),
(2,'Perfect Penalties','Score 5 penalty goals in a row',100),

(3,'Silent Assassin','Finish mission without being seen',120),
(3,'Parkour Expert','Climb 50 buildings',100),
(3,'Master Assassin','Perform 30 stealth kills',180),
(3,'Historian','Collect all hidden artifacts',150),

(4,'Ace','Get 5 kills in a round',200),
(4,'Headshot Machine','Achieve 100 headshots',150),
(4,'Clutch God','Win 25 1v3 situations',200),
(4,'Spike Master','Plant or defuse spike 50 times',120),

(5,'Speed Demon','Win 10 races',180),
(5,'Drift King','Drift for 5000 meters total',130),
(5,'Top Speed','Reach 350 km/h',150),
(5,'Garage Collector','Own 15 cars',200),

(6,'Builder','Craft 100 items',100),
(6,'Diamond Hunter','Mine 50 diamonds',100),
(6,'Architect','Build a structure with 1000 blocks',150),
(6,'Monster Slayer','Defeat 200 hostile mobs',130),

(7,'Sniper','Get 50 headshots',200),
(7,'Killstreak Master','Achieve a 20-kill streak',200),
(7,'War Hero','Complete campaign on Veteran',250),
(7,'Elite Sniper','Get 100 sniper kills',150),

(8,'Aerial Ace','Score 20 aerial goals',140),
(8,'Goalie Supreme','Save 50 goals',120),
(8,'Turbo Master','Use boost 5000 seconds total',150),

(9,'Explorer','Find all secret tombs',150),
(9,'Survivor','Clear 20 challenge tombs',150),
(9,'Archaeologist','Collect 100 relics',200),
(9,'Sharpshooter','Achieve 50 headshots',120),

(10,'Winner Winner','Win 10 matches',200),
(10,'Last Man Standing','Win without taking damage',250),
(10,'Survivalist','Survive for 30 minutes',120),
(10,'Squad Leader','Win 15 squad matches',200),

(11,'Master Explorer','Discover all shrines',250),
(11,'Weapon Master','Collect 50 weapon types',150),
(11,'Glider Expert','Travel 10 km using paraglider',120),
(11,'Elite Chef','Cook 50 unique dishes',130),

(12,'Legend Arena','Reach 6000 trophies',200),
(12,'Deck Builder','Create 20 unique decks',100),
(12,'Arena Legend','Reach Arena 14',150),
(12,'Elixir Master','Win 50 battles using 3.0 decks',130),

(13,'Elden Lord','Defeat the final boss',300),
(13,'Rune Hunter','Gather 1,000,000 runes',200),
(13,'Weapon Collector','Collect 40 weapons',120),
(13,'Tarnished Champion','Defeat 10 optional bosses',250),

(14,'Spartan Victory','Win 20 multiplayer matches',180),
(14,'Pilot Expert','Fly vehicles 5 hours',150),
(14,'Master Chief','Complete campaign on Heroic',200),
(14,'Arena Slayer','Get 300 multiplayer kills',180),

(15,'Sweet Crusher','Clear 500 levels',150),
(15,'Color Bomb Master','Create 200 color bombs',120),
(15,'Sugar Star','Achieve 3 stars in 100 levels',130),
(15,'Combo Expert','Trigger 50 candy combos',110),

(16,'Detective','Win as Impostor 10 times',120),
(16,'Crewmate Genius','Complete 200 tasks',140),
(16,'Master Impostor','Win 20 impostor games',180),
(16,'Trust Issues','Be falsely ejected 10 times',90),

(17,'Battle Royale','Get 10 Victory Royales',200),
(17,'Builder Pro','Build 5000 structures',150),
(17,'Sharpshooter','Get 80 sniper eliminations',150),
(17,'Storm Survivor','Survive 200 storm phases',120),

(18,'Star Collector','Collect 500 moons',220),
(18,'Jump King','Perform 5000 jumps',120),
(18,'Boss Crusher','Defeat all kingdom bosses',180),
(18,'Coin Collector','Collect 10,000 coins',150);

-- -----------------------------------------------------
-- BADGES
-- -----------------------------------------------------

INSERT INTO Badge (badge_id,name,description,criteria) VALUES
(1,'Collector','Own 10+ games','Own 10 games'),
(2,'Pro Gamer','Complete 5+ games','Complete 5 games'),
(3,'Explorer','Played on 3+ platforms','Play on 3 platforms'),
(4,'Achiever','Unlock 50 achievements','Unlock 50 achievements'),
(5,'Veteran','Play for 1 year','Joined 1 year ago');

-- -----------------------------------------------------
-- USER GAME
-- -----------------------------------------------------

INSERT INTO User_Game VALUES
(1,1,'2024-02-10',TRUE,'2024-03-01'),
(1,2,'2024-02-15',FALSE,NULL),
(1,3,'2024-02-20',TRUE,'2024-03-15'),
(2,1,'2024-03-10',TRUE,'2024-03-30'),
(2,4,'2024-04-01',FALSE,NULL),
(3,5,'2024-03-25',TRUE,'2024-04-05'),
(3,6,'2024-03-30',FALSE,NULL),
(4,7,'2024-04-10',TRUE,'2024-04-20'),
(5,8,'2024-05-01',FALSE,NULL),
(6,9,'2024-06-15',TRUE,'2024-07-01'),
(7,10,'2024-07-10',FALSE,NULL),
(8,2,'2024-07-20',TRUE,'2024-08-05'),

-- New:
(1,11,'2024-08-10',FALSE,NULL),
(2,12,'2024-08-12',TRUE,'2024-09-01'),
(3,13,'2024-08-15',FALSE,NULL),
(4,14,'2024-08-20',TRUE,'2024-09-10'),
(5,15,'2024-08-22',FALSE,NULL),
(6,16,'2024-09-01',TRUE,'2024-09-15'),
(7,17,'2024-09-05',FALSE,NULL),
(8,18,'2024-09-08',TRUE,'2024-10-01');

-- -----------------------------------------------------
-- USER ACHIEVEMENTS
-- -----------------------------------------------------

INSERT INTO User_Achievement VALUES
(1,1,'2024-02-12'),
(1,2,'2024-02-25'),
(1,10,'2024-03-10'),

(2,1,'2024-03-12'),
(3,20,'2024-04-02'),
(4,25,'2024-04-15'),
(4,28,'2024-04-18'),
(6,35,'2024-06-25'),
(7,40,'2024-07-15'),
(8,6,'2024-07-25'),

-- New:
(1,85,'2024-08-12'),
(2,89,'2024-08-30'),
(3,93,'2024-09-20'),
(4,97,'2024-09-12'),
(5,101,'2024-09-18'),
(6,105,'2024-09-16'),
(7,109,'2024-09-22'),
(8,113,'2024-10-05');

-- -----------------------------------------------------
-- USER BADGES
-- -----------------------------------------------------

INSERT INTO User_Badge VALUES
(1,1,'2024-03-20'),
(1,2,'2024-03-25'),
(2,2,'2024-04-01'),
(3,3,'2024-04-10'),
(4,4,'2024-04-25'),
(5,1,'2024-05-15'),
(6,5,'2024-06-20'),
(7,3,'2024-07-18'),
(8,2,'2024-08-10'),

-- New:
(1,3,'2024-08-20'),
(2,5,'2024-09-05'),
(3,1,'2024-09-10'),
(4,2,'2024-09-15'),
(5,4,'2024-09-18'),
(6,3,'2024-10-01'),
(7,5,'2024-10-04'),
(8,1,'2024-10-10');
