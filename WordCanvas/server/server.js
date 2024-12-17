const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB connected"))
  	.catch((err) => console.error("MongoDB connection error:", err));

// Define routes
app.get("/", (req, res) => {
  res.send("Welcome to WordCanvas API");
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
