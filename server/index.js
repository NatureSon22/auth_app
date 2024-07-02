import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

// error handler
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong!";
  res.status(status).json({ status, success: false, message });
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Successfully connected to the database`);

    app.listen(PORT, () => {
      console.log(`The server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
})();

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});
