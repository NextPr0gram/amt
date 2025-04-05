"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { protectedFetch } from "@/utils/protected-fetch";

export type Module = {
    id: number;
    code: string;
    tp: string;
    name: string;
    year: string;
    yearId: number;
    lead: string;
    leadId: number | undefined;
    moduleTutorIds: number[];
};

type ModuleAPIResponse = {
    id: number;
    code: string;
    tp: {
        name: string
    }
    name: string;
    year: {
        id: number;
        name: string;
    };
    moduleLead: {
        id: number;
        firstName: string;
        lastName: string;
    };
    moduleTutors: {
        userId: number;
    }[];
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
            id: module.id,
            code: module.code,
            tp: module.tp.name,
            name: module.name,
            year: module.year.name,
            yearId: module.year.id,
            lead: module.moduleLead ? `${module.moduleLead.firstName} ${module.moduleLead.lastName}` : null,
            leadId: module.moduleLead.id,
            moduleTutorIds: module.moduleTutors.map((tutor) => tutor.userId),
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
