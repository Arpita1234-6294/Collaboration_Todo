const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
//const taskRoutes = require("./routes/taskRoutes");
//const logRoutes = require("./routes/logRoutes");

// ✅ FIRST: initialize express app!
const app = express();

// ✅ THEN: use middleware
app.use(cors());
app.use(express.json());

// ✅ THEN: use routes
app.use("/api/auth", authRoutes);
//app.use("/api/tasks", taskRoutes);
//app.use("/api/logs", logRoutes);

// ✅ Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error", err));


// ✅ Basic test route
app.get("/", (req, res) => {
  res.send("Hello, backend is working!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
