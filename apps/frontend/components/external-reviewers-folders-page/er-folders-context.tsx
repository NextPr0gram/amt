"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { protectedFetch } from "@/utils/protected-fetch";

export type ERFolder = {
    id: string;
    email: string;
    folderId: string;
};

type ERFoldersContextType = {
    erFolders: ERFolder[];
    fetchERFolders: () => void;
};

const ERFoldersContext = createContext<ERFoldersContextType | undefined>(undefined);

export const ERFoldersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [erFolders, setERFolders] = useState<ERFolder[]>([]);
    const [isAssessmentLead, setIsAssessmentLead] = useState(false);

    const fetchERFolders = async () => {
        const res = await protectedFetch("/er/folders", "GET");
        setERFolders(res.data);
    };

    useEffect(() => {
        const fetchIsAssessmentLead = async () => {
            try {
                const res = await protectedFetch("/user/user-roles", "GET");
                if (res.data && Array.isArray(res.data)) {
                    const hasAssessmentLeadRole = res.data.some((role: { role: { id: number; name: string } }) => role.role.id === 1);

                    setIsAssessmentLead(hasAssessmentLeadRole);
                } else {
                    console.error("Invalid user roles data:", res.data);
                    setIsAssessmentLead(false);
                }
            } catch (error) {
                console.error("Failed to fetch user roles:", error);
                setIsAssessmentLead(false);
            }
        };
        fetchIsAssessmentLead();
        if (isAssessmentLead) {
            fetchERFolders();
        }
    }, [isAssessmentLead]);

    return <ERFoldersContext.Provider value={{ erFolders, fetchERFolders }}>{children}</ERFoldersContext.Provider>;
};

export const useERFolders = () => {
    const context = useContext(ERFoldersContext);
    if (!context) {
        throw new Error("useERFolders must be used within a ERFoldersProvider");
    }
    return context;
};
