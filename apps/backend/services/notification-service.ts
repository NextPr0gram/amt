import { io } from "../server";
import { logMsg, logType } from "../utils/logger";
import { users } from "./websocket-service";

// Send notification to a specific user
export const sendNotification = (
    userId: number,
    type: NotificationType,
    title: string,
    message?: string,
) => {
    const socketId = users.get(userId);
    if (socketId) {
        io.to(socketId).emit("notification", { message });
        logMsg(
            logType.WEBSOCKET,
            `Notification sent to user ${userId}: ${message}`,
        );
    } else {
        logMsg(logType.WEBSOCKET, `User ${userId} not connected`);
    }
};

type NotificationType = "info" | "warning" | "error";

// Broadcast notification to all users
export const broadcastNotification = (
    type: NotificationType,
    title: string,
    message?: string,
) => {
    message === undefined ? "" : message;
    io.emit("notification", { type, title, message });
    logMsg(
        logType.WEBSOCKET,
        `Broadcast notification: title: ${title} message: ${message === "" ? "none" : message}`,
    );
};
