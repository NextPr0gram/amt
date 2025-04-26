"use client";
import { protectedFetch } from "@/utils/protected-fetch";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the shape of the context value
interface DemoDateContextType {
    date: Date | null;
    fetchDate: () => Promise<void>;
}

// Update the context type
const DemoDateContext = createContext<DemoDateContextType | null>(null);

export const DemoDateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [date, setDate] = useState<Date | null>(null);

    const fetchDate = async () => {
        try {
            const res = await protectedFetch("/demo/get-date", "GET");

            if (res.data && typeof res.data === "string") {
                const resDate = new Date(res.data).toDateString();
                setDate(resDate);
            } else {
                console.error("Invalid date format received:", res.data);
                setDate(null);
            }
        } catch (error) {
            console.error("Failed to fetch demo date:", error);
            setDate(null);
        }
    };

    useEffect(() => {
        fetchDate();
    }, []);

    return <DemoDateContext.Provider value={{ date, fetchDate }}>{children}</DemoDateContext.Provider>;
};

export const useDemoDate = (): DemoDateContextType | null => {
    const context = useContext(DemoDateContext);

    if (context === null) {
        console.error("useDemoDate must be used within a DemoDateProvider");
    }
    return context;
};
