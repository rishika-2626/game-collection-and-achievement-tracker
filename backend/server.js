const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./config/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Server is running!");
})

app.get("/dbtest", (req, res) => {
    const q = "SELECT * FROM User LIMIT 1";
    db.query(q, (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: err });
        }
        console.log("DB Result:", result);
        res.json(result);
    });
});


// const userRoutes = require("./routes/userRoutes");
// const gameRoutes = require("./routes/gameRoutes");
// const achievementRoutes = require("./routes/achievementRoutes");
// const badgeRoutes = require("./routes/badgeRoutes");
// const analyticsRoutes = require("./routes/analyticsRoutes");


// app.use("/users", userRoutes);
// app.use("/games", gameRoutes);
// app.use("/achievements", achievementRoutes);
// app.use("/badges", badgeRoutes);
// app.use("/analytics", analyticsRoutes);

const PORT = 5001;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));