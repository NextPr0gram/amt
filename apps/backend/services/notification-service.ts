import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/http";
import prisma from "../prisma/primsa-client";
import { io } from "../server";
import appAssert from "../utils/app-assert";
import { logMsg, logType } from "../utils/logger";
import { users } from "./websocket-service";

// Queue to hold pending notifications per user
const notificationQueue: Map<number, NotificationData[]> = new Map();

type NotificationType = "info" | "warning" | "error";
let notificationTypes: { id: number; name: string }[] = [];

const loadNotificationTypes = async () => {
    const result = await prisma.notificationType.findMany();
    notificationTypes = result;
};

loadNotificationTypes();

type NotificationData = {
    type: NotificationType;
    title: string;
    message?: string;
};

// Send notification to a specific user
export const sendNotification = async (
    userId: number,
    type: NotificationType,
    title: string,
    message?: string,
) => {
    // Add notification to database
    const notificationTypeId = notificationTypes.find(
        (nt) => nt.name === type,
    )?.id;

    const createNotification = await prisma.notification.create({
        data: {
            title,
            message,
            notificationType: {
                connect: { id: notificationTypeId }, // Connect existing notification type
            },
            userNotification: {
                create: {
                    userId,
                },
            },
        },
        include: {
            userNotification: true,
            notificationType: true,
        },
    });
    appAssert(
        createNotification,
        INTERNAL_SERVER_ERROR,
        "Could not create notifications in database",
    );

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
export const broadcastNotification = async (
    type: NotificationType,
    title: string,
    message?: string,
) => {
    const usersInDb = await prisma.user.findMany({
        select: { id: true },
    });
    appAssert(usersInDb, NOT_FOUND, "Could not retrieve users");
    const registeredUserIds = usersInDb.map((user) => user.id);
    const notificationTypeId = notificationTypes.find(
        (nt) => nt.name === type,
    )?.id;
    const createNotification = await prisma.notification.create({
        data: {
            title,
            message,
            notificationType: {
                connect: { id: notificationTypeId }, // Connect existing notification type
            },
            userNotification: {
                create: registeredUserIds.map((userId) => ({
                    user: {
                        connect: { id: userId }, // Connect each user in registeredUserIds
                    },
                })),
            },
        },
        include: {
            userNotification: true,
            notificationType: true,
        },
    });
    appAssert(
        createNotification,
        INTERNAL_SERVER_ERROR,
        "Could not create notifications in database",
    );

    registeredUserIds.forEach(async (userId) => {
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
