import express from "express";
import { getAllUsers, updateUser } from "../controllers/user.controller.js";
import verifyUser from "../utils/verifyUser.js";

const userRoute = express.Router();

userRoute.get("/", getAllUsers);
userRoute.put("/update/:id", verifyUser, updateUser);

export default userRoute;
