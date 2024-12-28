const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const BlogPost = require("./models/BlogPost");
const User = require("./models/User");

dotenv.config({ path: "../.env" }); // Ensure the .env file is correctly loaded

const populateDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing data (optional)
    await BlogPost.deleteMany({});
    await User.deleteMany({});
    console.log("Existing data cleared");

    // Create hashed passwords
    const hashedPassword1 = await bcrypt.hash("password123", 10);
    const hashedPassword2 = await bcrypt.hash("securepassword", 10);
    const hashedPassword3 = await bcrypt.hash("mypassword", 10);

    // Create users
    const users = await User.insertMany([
      { name: "John Doe", email: "johndoe@example.com", password: hashedPassword1 },
      { name: "Jane Smith", email: "janesmith@example.com", password: hashedPassword2 },
      { name: "Alice Johnson", email: "alicejohnson@example.com", password: hashedPassword3 },
    ]);
    console.log("Users created:", users);

    // Create blog posts
    const blogs = await BlogPost.insertMany([
      { title: "First Blog Post", content: "Content of the first blog", author: users[0]._id },
      { title: "Second Blog Post", content: "Content of the second blog", author: users[1]._id },
      { title: "Tech Innovations", content: "Exploring the latest in tech.", author: users[2]._id },
      { title: "Health and Wellness", content: "Tips for a healthy lifestyle.", author: users[0]._id },
      { title: "Travel Diaries", content: "Adventures around the world.", author: users[1]._id },
    ]);
    console.log("Blog posts created:", blogs);

    console.log("Database populated successfully");
    process.exit();
  } catch (error) {
    console.error("Error populating database:", error);
    process.exit(1); // Exit with failure
  }
};

populateDatabase();
