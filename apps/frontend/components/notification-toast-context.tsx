"use client";
import useSocket from "@/hooks/useSocket";
import { protectedFetch } from "@/utils/protected-fetch";
import { Bell, TriangleAlert } from "lucide-react";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

const NotificationToastContext = createContext(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

    console.log("userId: ", userId);
    // Create socket only when we have userId
    const socket = useSocket(userId);

    // Second effect: handle socket notifications
    useEffect(() => {
        if (!socket) return;

        socket.on("notification", (data: { message: string; type: string; title: string }) => {
            switch (data.type) {
                case "info":
                    toast(data.title, { icon: <Bell className="size-5 mx-2" />, description: data.message, duration: 15000 });
                    break;
                case "warning":
                    toast(data.title, { icon: <TriangleAlert className="size-5 mx-2" />, description: data.message, duration: 15000 });
                    break;
                case "error":
                    toast.error(data.title, { description: data.message, duration: 15000 });
                    break;
            }
        });

        return () => {
            socket.off("notification");
        };
    }, [socket]);

    return <NotificationToastContext.Provider value={null}>{children}</NotificationToastContext.Provider>;
};
