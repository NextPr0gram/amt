import prisma from "../prisma/primsa-client";
import { io } from "../server";
import { logMsg, logType } from "../utils/logger";
import { users } from "./websocket-service";

// Queue to hold pending notifications per user
const notificationQueue: Map<number, NotificationData[]> = new Map();

type NotificationType = "info" | "warning" | "error";

type NotificationData = {
    type: NotificationType;
    title: string;
    message?: string;
};

// Send notification to a specific user
export const sendNotification = (
    userId: number,
    type: NotificationType,
    title: string,
    message?: string,
) => {
    const socketId = users.get(userId);
    if (socketId) {
        // Flush any queued notifications first
        flushNotificationQueue(userId, socketId);
        io.to(socketId).emit("notification", { type, title, message });
        logMsg(
            logType.WEBSOCKET,
            `Notification sent to user ${userId}: ${message}`,
        );
    } else {
        const queued = notificationQueue.get(userId) || [];
        queued.push({ type, title, message });
        notificationQueue.set(userId, queued);
        logMsg(
            logType.WEBSOCKET,
            `User ${userId} not connected, notification queued`,
        );
    }
};

// Broadcast notification to all registered users
export const broadcastNotification = (
    type: NotificationType,
    title: string,
    message?: string,
) => {
    return prisma.user
        .findMany({
            select: { id: true },
        })
        .then((userIds) => {
            const registeredUserIds = userIds.map((user) => user.id);
            registeredUserIds.forEach((userId) => {
                const socketId = users.get(userId);
                if (socketId) {
                    flushNotificationQueue(userId, socketId);
                    io.to(socketId).emit("notification", {
                        type,
                        title,
                        message,
                    });
                    logMsg(
                        logType.WEBSOCKET,
                        `Broadcast notification sent to user ${userId}: title ${title}, message: ${message || "none"}`,
                    );
                } else {
                    const queued = notificationQueue.get(userId) || [];
                    queued.push({ type, title, message });
                    notificationQueue.set(userId, queued);
                    logMsg(
                        logType.WEBSOCKET,
                        `User ${userId} offline, broadcast notification queued`,
                    );
                }
            });
        })
        .catch((error) => {
            logMsg(
                logType.WEBSOCKET,
                `Error broadcasting notifications: ${error}`,
            );
        });
};

/**
 * Call this function when a user connects.
 * It will send any queued notifications to the connected client.
 */
export const flushNotificationQueue = (userId: number, socketId: string) => {
    const queued = notificationQueue.get(userId);
    if (queued && queued.length > 0) {
        queued.forEach((notification) => {
            io.to(socketId).emit("notification", notification);
        });
        notificationQueue.delete(userId);
        logMsg(
            logType.WEBSOCKET,
            `Flushed ${queued.length} notifications for user ${userId}`,
        );
    }
};
