"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const ModulesContext = createContext<{ isModuleAdded: boolean; setIsModuleAdded: React.Dispatch<React.SetStateAction<boolean>> } | undefined>(undefined);

export const ModulesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isModuleAdded, setIsModuleAdded] = useState(false);
    useEffect(() => {
        console.log("Module added: ", isModuleAdded);
    }, [isModuleAdded]);

    return <ModulesContext.Provider value={{ isModuleAdded, setIsModuleAdded }}>{children}</ModulesContext.Provider>;
};

export const useModules = () => {
    const context = useContext(ModulesContext);
    if (!context) {
        throw new Error("useModules must be used within a ModulesProvider");
    }
    return context;
};
