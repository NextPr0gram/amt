"use client";
import useSocket from "@/hooks/useSocket";
import { protectedFetch } from "@/utils/protected-fetch";
import { Bell, TriangleAlert } from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

type websocketContextType = {
    socket: Socket | null;
};

const WebsocketContext = createContext<websocketContextType | undefined>(undefined);

export const WebsocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<number | null>(null);

    // First effect: fetch the user ID
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const user = await protectedFetch("/user", "GET");
                if (typeof user.data.id === "number") {
                    setUserId(user.data.id);
                } else {
                    console.error("User ID is not a number:", user.data.id);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
            }
        };

        fetchUserId();
    }, []);

    const socket = useSocket(userId);

    // Second effect: handle socket notifications
    useEffect(() => {
        if (!socket) return;

        socket.on("notification", (data: { message: string; type: string; title: string }) => {
            notify(data.type as "info" | "warning" | "error" | "success", data.title, data.message)
        });

        return () => {
            socket.off("notification");
        };
    }, [socket]);

    return <WebsocketContext.Provider value={{ socket }}>{children}</WebsocketContext.Provider>;
};
export const useWebsocket = () => {
    const context = useContext(WebsocketContext);
    if (!context) {
        throw new Error("useWebsocket must be used within a WebsocketProvider");
    }
    return context;
};
export const notify = (type: "info" | "warning" | "error" | "success", title: string, message?: string) => {
    switch (type) {
        case "info":
            toast(title, { icon: <Bell className="size-5 mx-2" />, description: message, duration: 15000 });
            break;
        case "warning":
            toast(title, { icon: <TriangleAlert className="size-5 mx-2" />, description: message, duration: 15000 });
            break;
        case "error":
            toast.error(title, { description: message, duration: 15000 });
            break;
        case "success":
            toast.success(title, { description: message, duration: 15000 });
            break;
    }

}
