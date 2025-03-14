import { Server } from "socket.io";
import { users } from "./websocket-service";

// Send notification to a specific user
export const sendNotification = (io: Server, userId: string, message: string) => {
    const socketId = users.get(userId);
    if (socketId) {
        io.to(socketId).emit("notification", { message });
        console.log(`Notification sent to user ${userId}: ${message}`);
    } else {
        console.log(`User ${userId} not connected`);
    }
};

type NotificationType = "info" | "warning" | "error";

// Broadcast notification to all users
export const broadcastNotification = (io: Server, type: NotificationType, title: string, message: string) => {
    io.emit("notification", { type, title, message });
    console.log(`Broadcast notification: ${message}`);
};