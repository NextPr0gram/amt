import { Server, Socket } from "socket.io";

// userId -> socketId mapping
export const users = new Map<string, string>();

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

