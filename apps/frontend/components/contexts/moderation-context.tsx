"use client";
import { protectedFetch } from "@/utils/protected-fetch";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useWebsocket } from "./websocket-context";

type ModerationStatus = {
    moderationPhase: {

        tP: {
            id: number;
            name: string;
        };
        stage: {
            id: number;
            name: string;
        };
        reviewType: {
            id: number;
            name: string;
        };
    };
    internalModerationDeadline: Date;
    externalModerationDeadline: Date;
    finalDeadline: Date;

};
type ModerationContextType = {
    moderationStatus: ModerationStatus | null;
    fetchModerationStatus: () => void;
};

const ModerationContext = createContext<ModerationContextType | undefined>(undefined);

export const ModerationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [moderationStatus, setModerationStatus] = useState<ModerationStatus | null>(null);

    const { socket } = useWebsocket();

    const fetchModerationStatus = async () => {
        const res = await protectedFetch("/moderation/status", "GET");
        setModerationStatus(res.data);
    };
    useEffect(() => {
        fetchModerationStatus();
    }, []);

    // Create socket only when we have userId

    // Second effect: handle socket notifications
    useEffect(() => {
        if (!socket) return;

        socket.on("moderationStatus", () => {
            fetchModerationStatus();
        });

        return () => {
            socket.off("notification");
        };
    }, [socket]);

    return <ModerationContext.Provider value={{ moderationStatus, fetchModerationStatus }}>{children}</ModerationContext.Provider>;
};
export const useModeration = () => {
    const context = useContext(ModerationContext);
    if (!context) {
        throw new Error("useModeration must be used within a ModerationProvider");
    }
    return context;
};
