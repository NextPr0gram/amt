import { Server, Socket } from "socket.io";
import { logMsg, logType } from "../utils/logger";
import { flushNotificationQueue } from "./notification-service";

// userId -> socketId mapping
export const users = new Map<number, string>();

export const setupWebSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        logMsg(logType.WEBSOCKET, `User connected: ${socket.id}`);

        // Store user when they register
        socket.on("register", (userId: number) => {
            users.set(userId, socket.id);
            flushNotificationQueue(userId, socket.id);
            logMsg(
                logType.WEBSOCKET,
                `User ${userId} registered with socket ${socket.id}`,
            );
        });

        // Remove user on disconnect
        socket.on("disconnect", () => {
            const userId = [...users.entries()].find(
                ([_, id]) => id === socket.id,
            )?.[0];
            if (userId) {
                users.delete(userId);
                logMsg(logType.WEBSOCKET, `User ${userId} disconnected`);
            }
        });
    });
};

// Notifications
