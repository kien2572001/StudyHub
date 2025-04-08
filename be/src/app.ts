// src/app.ts

import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from './routes';
import { HttpStatus } from "./constants";
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// 1. Các middleware xử lý request
app.use(morgan("dev"));
app.use(helmet());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per window
    }),
);
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// 2. Routes
// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        statusCode: HttpStatus.OK,
        message: "Server is running",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// Root route
app.get("/", (req, res) => {
    res.send("Secure Express Server");
});

// Tất cả các routes khác từ routes.js
app.use(routes);

// 3. 404 handler - đặt sau tất cả các routes
app.use((req: Request, res: Response) => {
    res.status(404).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: "Resource not found"
    });
});

// 4. Error handling middleware - luôn đặt cuối cùng
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorMiddleware(err, req, res, next);
});

export default app;

