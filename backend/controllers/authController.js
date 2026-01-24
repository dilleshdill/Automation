import { UserRegister } from "../models/userRegister.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateUserToken from "../utils/generateUserToken.js";

dotenv.config();

//user Register

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Validation
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check existing user
    const existingUser = await UserRegister.findOne({ email });
    

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Password Hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = new UserRegister({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT
    const token = generateUserToken(newUser._id, newUser.email);
    

    // Save token in cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    // Send Response
    return res.status(201).json({
      message: "Registration successful",
      data: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error("Register Error:", error.message);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// user login

export const userLogin = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const existingUser = await UserRegister.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateUserToken(existingUser._id, existingUser.email);

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // console.log("token",token)
    res
      .status(200)
      .json({ message: "User logged in successfully", data: existingUser._id });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
