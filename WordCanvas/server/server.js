const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const errorHandler = require("./middleware/errorHandler");


dotenv.config();

const app = express();
const path = require("path");

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
  res.json({
    message: "Welcome to WordCanvas API",
    documentation: "/api/docs",
    });
});

//doc route
app.get("/api/docs", (req, res) => {
    res.sendFile(path.join(__dirname, "docs.html"));
});

// for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Error handling middleware
app.use(errorHandler);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
