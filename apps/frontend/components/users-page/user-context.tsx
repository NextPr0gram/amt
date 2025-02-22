"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { protectedFetch } from "@/utils/protected-fetch";

export type User = {
    id: number;
    firstName: string;
    lastName: string;
};

type UsersContextType = {
    users: User[];
    fetchUsers: () => void;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        const res = await protectedFetch("/users", "GET");
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return <UsersContext.Provider value={{ users, fetchUsers }}>{children}</UsersContext.Provider>;
};

export const useUsers = () => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error("useUsers must be used within a UsersProvider");
    }
    return context;
};
