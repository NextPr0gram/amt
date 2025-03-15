import { io } from "../server";

// update all clients via websocket
export const updateClients = async () => {
    io.emit("moderationStatus");
    console.log(`update clients on moderation status`);
};
