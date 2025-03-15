import { Server } from "socket.io";
import prisma from "../prisma/primsa-client";

// update all clients via websocket
export const updateClients = async (io: Server) => {
    io.emit("moderationStatus");
    console.log(`update clients on moderation status`);
};
