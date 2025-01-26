const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");
const { body } = require("express-validator");

//load environment variables
require('dotenv').config();


// Validate the presence of JWT_SECRET
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res, next) => {
    console.log("Login route hit"); // Log when login route is hit
    login(req, res, next);
  }
);


// Signup Route
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  (req, res, next) => {
    console.log("Signup route hit"); // Log when signup route is hit
    signup(req, res, next);
  }
);


module.exports = router;
