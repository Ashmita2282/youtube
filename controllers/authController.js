// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
// Register Controller
const register = async (req, res) => {
  const { name, userName, email, password, location, dateOfBirth } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      name,
      userName,
      email,
      password: hashedPassword,
      location,
      dateOfBirth,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, userName, password } = req.body;

  try {
    // Find user by either email or userName
    const user = await UserModel.findOne({
      $or: [{ email }, { userName }],
    });

    // If user is not found, return an error message
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email/username or password." });
    }

    // Check if the provided password matches the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid email/username or password." });
    }

    // Generate JWT token with user details for authentication
    const token = jwt.sign(
      { _id: user._id, userName: user.userName, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    // Send success response with token and user data
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    // Catch any errors and send a 500 response with error details
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export default { register, login };
