import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// Configuration
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const jwtSecret = process.env.JWT_SECRET;

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email already exists
    let existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw errorHandler(409, "Account already exists!");
    }

    // Check if the username already exists
    existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw errorHandler(409, "Username already exists!");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
    const { password: _, ...data } = user._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
    });
    res.status(201).json({ user: data });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validUser = await UserModel.findOne({ email });
    if (!validUser) {
      throw errorHandler(404, "User not found!");
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      throw errorHandler(401, "Wrong credentials!");
    }

    const { password: _, ...user } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, jwtSecret, {
      expiresIn: "1h",
    });

    res.cookie("access_token", token, {
      httpOnly: true,
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const googleSignIn = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;
    let user = await UserModel.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
      console.log(token);
      res.cookie("access_token", token, {
        httpOnly: true,
      });
      res.status(200).json({ user });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(generatePassword, salt);

      // Create the user
      const newUser = await UserModel.create({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email,
        password: hashedPassword,
        profilePic: photo,
      });

      const token = jwt.sign({ id: newUser._id }, jwtSecret, {
        expiresIn: "1h",
      });
      res.cookie("access_token", token, {
        httpOnly: true,
      });
      res.status(201).json({ user: newUser });
    }
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ success: true });
};

export { signup, signin, googleSignIn, signOut };
