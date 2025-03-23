import prisma from "./prisma/primsa-client";
import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./constants/env";
import errorHandler from "./middleware/error-handler";
import router from "./routes/router";
import logRequests from "./middleware/log-requests";
import { Server } from "socket.io";
import http from "http";
import { setupWebSocket } from "./services/websocket-service";
import { processModerationStatus } from "./services/moderation-process-service";
import { logMsg, logType } from "./utils/logger";

dotenv.config();

// start the webserver
const app = express();
const server = http.createServer(app);
prisma.$connect().then(() => {
    processModerationStatus().catch((error) =>
        console.error("Error processing stages:", error),
    );
});

export const io = new Server(server, {
    cors: {
        origin: process.env.APP_ORIGIN, // Allow frontend origin for WebSocket connections
        credentials: true,
    },
});

setupWebSocket(io);

// Initialise middlewares
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(express.urlencoded({ extended: true })); // Allows parsing of URL-encoded request bodies
app.use(cors({ origin: process.env.APP_ORIGIN, credentials: true })); // Enable CORS, only allow requests from our frontend next.js app
app.use(cookieParser()); // Allows parsing of cookies in the request headers

app.use("/api/v1/", logRequests, router);

// Error handler middleware
app.use(errorHandler);

// Start the server
server.listen(PORT, () => {
    logMsg(logType.SERVER, `Example app listening on port ${PORT}`);
});
