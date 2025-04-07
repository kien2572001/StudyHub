// src/app.ts

import express, { NextFunction, Request, Response } from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
// Security middleware
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from './routes';
import {HttpStatus} from "./constants";
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Logger middleware
app.use(morgan("dev"));

// Security headers
app.use(helmet());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
  }),
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static assets
app.use(express.static("public"));
// API Routes

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    statusCode: HttpStatus.OK,
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 404
// Routes
app.get("/", (req, res) => {
  res.send("Secure Express Server");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: "Internal Server Error" });
});

app.use(routes);

// Error handling middleware (phải đặt sau routes)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorMiddleware(err, req, res, next);
});

export default app;
