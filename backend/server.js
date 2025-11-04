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
app.use("/users", userRoutes);

const PORT = 5000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));