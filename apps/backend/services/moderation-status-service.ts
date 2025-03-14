import { Server } from "socket.io";
import prisma from "../prisma/primsa-client";



// update all clients via websocket
export const updateClients = async (io: Server) => {
    const moderationPhase = await prisma.moderationPhase.findFirst()
    io.emit("moderationStatus");
    console.log(`update clients on moderation status`);
};
