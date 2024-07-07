//imports
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const orgRoutes = require("./routes/orgRoutes");
const userRoutes = require("./routes/userRoutes");

//config
const app = express();
const PORT = process.env.PORT || 3000;

//enviroment variables config
require("dotenv").config();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db
const db = require("./models/index");

//routes
app.use("/auth", authRoutes);
app.use("/api/organisations", orgRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ statusCode: 200 });
});

app.listen(PORT, async () => {
  db.sequelize
    .sync({ force: true })
    .then(() => {
      console.log(`Live at port ${PORT}`);
    })
    .catch((error) => {
      console.log("Error Syncing Database", error);
    });
});
