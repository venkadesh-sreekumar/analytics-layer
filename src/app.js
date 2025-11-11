import express from "express";
import bodyParser from "body-parser";
import analyticsRoutes from "./routes/analytics.routes.js";
import cors from "cors";

const app = express();

// IMPORTANT: Enable CORS BEFORE other middleware
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);


app.use(bodyParser.json());
app.use("/api/analytics", analyticsRoutes);


export default app;
