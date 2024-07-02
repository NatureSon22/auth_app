import UserModel from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id)
    const { username, email, password, profilePic } = req.body;

    //console.log("6680b80739c55a5dc244e53e" + " " + id)
    // if (req.user._id !== id) {
    //   throw errorHandler(401, "You can update only your account!");
    // }
    // Prepare the update object
    const update = {};
    if (username) update.username = username;
    if (email) update.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      update.password = hashedPassword;
    }
    if (profilePic) update.profilePic = profilePic;

    // Update user
    const user = await UserModel.findByIdAndUpdate({ _id: id }, update, { new: true });

    if (!user) {
      throw errorHandler(404, "User not found!");
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export { getAllUsers, updateUser };
