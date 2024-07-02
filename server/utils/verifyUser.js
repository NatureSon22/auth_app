import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(errorHandler(401, "You need to login"));
    }

    jwt.verify(
      token,
      jwtSecret,
      (err, user) => {
        if (err) {
          console.error("JWT Verification Error:", err);
          return next(errorHandler(401, "Invalid token"));
        }

        req.user = user;

        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

export default verifyUser;
