// hooks/useSocket.js
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const useSocket = (userId: number | null) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!userId) return;
        // Establish socket connection
        const socketIo = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
            query: { userId },
        });
        console.log("Connecting to socket server...");

        setSocket(socketIo);

        console.log("Socket connected!", socketIo);
        // Register the user after the socket is connected
        socketIo.emit("register", userId);

        // Cleanup socket when the component is unmounted
        return () => {
            socketIo.disconnect();
        };
    }, [userId]);

    return socket;
};

export default useSocket;
