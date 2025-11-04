const mysql = require("mysql2");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database: "game_tracker_db"
});

db.connect((err) => {
    if(err){
        console.error("Database connection failed:", err);
    }
    else {
        console.log("Connected to MySQL database");
    }
});

module.exports = db;