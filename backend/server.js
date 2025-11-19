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

const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const badgeRoutes = require("./routes/badgeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.use("/users", userRoutes);
app.use("/games", gameRoutes);
app.use("/achievements", achievementRoutes);
app.use("/badges", badgeRoutes);
app.use("/analytics", analyticsRoutes);

const PORT = 5001;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));