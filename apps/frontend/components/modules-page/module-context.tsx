"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { protectedFetch } from "@/utils/protected-fetch";

export type Module = {
    code: string;
    name: string;
    year: "1" | "2" | "3" | "PG";
    lead: string;
    leadId: number | undefined;
};

type ModuleAPIResponse = {
    id: string;
    name: string;
    year: "1" | "2" | "3" | "PG";
    moduleLead: {
        id: number;
        firstName: string;
        lastName: string;
    };
};

type ModulesContextType = {
    modules: Module[];
    fetchModules: () => void;
};

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

export const ModulesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modules, setModules] = useState<Module[]>([]);

    const fetchModules = async () => {
        const res = await protectedFetch("/modules", "GET");
        const resData = res.data.map((module: ModuleAPIResponse) => ({
            code: module.id,
            name: module.name,
            year: module.year,
            lead: module.moduleLead ? `${module.moduleLead.firstName} ${module.moduleLead.lastName}` : null,
            leadId: module.moduleLead.id,
        }));
        setModules(resData);
    };

    useEffect(() => {
        fetchModules();
    }, []);

    return <ModulesContext.Provider value={{ modules, fetchModules }}>{children}</ModulesContext.Provider>;
};

export const useModules = () => {
    const context = useContext(ModulesContext);
    if (!context) {
        throw new Error("useModules must be used within a ModulesProvider");
    }
    return context;
};
