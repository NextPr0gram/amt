import { Server, Socket } from "socket.io";

// userId -> socketId mapping
const users = new Map<string, string>();

export const setupWebSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Store user when they register
        socket.on("register", (userId: string) => {
            users.set(userId, socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

        // Remove user on disconnect
        socket.on("disconnect", () => {
            const userId = [...users.entries()].find(([_, id]) => id === socket.id)?.[0];
            if (userId) {
                users.delete(userId);
                console.log(`User ${userId} disconnected`);
            }
        });
    });
};

// Notifications

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
type NotificationCategory = "general" | "module" | "review-group";

// Broadcast notification to all users
export const broadcastNotification = (io: Server, type: NotificationType, category: NotificationCategory, message: string) => {
    io.emit("notification", { type, category, message });
    console.log(`Broadcast notification: ${message}`);
};
