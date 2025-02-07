import express from "express";
import { googleSignIn, signOut, signin, signup } from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.post("/signup", signup);
authRoute.post("/signin", signin);
authRoute.post("/google", googleSignIn)
authRoute.get("/signout", signOut)

export default authRoute;
