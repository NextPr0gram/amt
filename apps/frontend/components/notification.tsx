import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import { protectedFetch } from "@/utils/protected-fetch";

const Notification = () => {
    const [notifications, setNotifications] = useState<string[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // First effect: fetch the user ID
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                setIsLoading(true);
                const user = await protectedFetch("/user", "GET");
                if (typeof user.data.id === "number") {
                    setUserId(user.data.id);
                } else {
                    console.error("User ID is not a number:", user.data.id);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserId();
    }, []);

    console.log("userId: ", userId);
    // Create socket only when we have userId
    const socket = useSocket(userId);

    // Second effect: handle socket notifications
    useEffect(() => {
        if (!socket || isLoading) return;

        socket.on("notification", (data) => {
            setNotifications((prev) => [...prev, data.message]);
            console.log("Notification received:", data.message);
        });

        return () => {
            socket.off("notification");
        };
    }, [socket, isLoading]);

    if (isLoading) {
        return <div>Loading user data...</div>;
    }

    return (
        <div>
            <h3>Notifications</h3>
            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                <ul>
                    {notifications.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notification;
