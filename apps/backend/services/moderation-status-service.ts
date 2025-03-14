import { Server } from "socket.io";



// update all clients via websocket
export const updateClients = (io: Server) => {
    io.emit("moderationStatus");
    console.log(`update clients on moderation status`);
};
