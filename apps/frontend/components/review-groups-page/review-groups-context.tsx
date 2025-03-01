"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { protectedFetch } from "@/utils/protected-fetch";

export type ReviewGroup = {
    id: number;
    yearId: number;
    year: string;
    group: string;
    modules: {
        id: number;
        code: string;
        name: string;
        moduleLead: string;
        shortNameML: string;
        moduleTutors: string[];
        shortNameMT: string[];
    }[];
    shortConvener: string;
    convener: number;
    convenerName: string;
};

type ReviewGroupAPIResponse = {
    id: number;
    year: {
        id: number;
        name: string;
    };
    group: string;
    modules: {
        module: {
            id: number;
            code: string;
            name: string;
            moduleLead: {
                id: number;
                firstName: string;
                lastName: string;
            };
            moduleTutors: {
                user: {
                    id: number;
                    firstName: string;
                    lastName: string;
                };
            }[];
        };
    }[];
    convener: {
        id: number;
        firstName: string;
        lastName: string;
    };
};

type ReviewGroupsContextType = {
    reviewGroups: ReviewGroup[];
    fetchReviewGroups: () => void;
};

const ReviewGroupsContext = createContext<ReviewGroupsContextType | undefined>(undefined);

export const ReviewGroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reviewGroups, setReviewGroups] = useState<ReviewGroup[]>([]);

    const fetchReviewGroups = async () => {
        const res = await protectedFetch("/review-groups", "GET");
        const resData = res.data.map((reviewGroup: ReviewGroupAPIResponse) => ({
            id: reviewGroup.id,
            yearId: reviewGroup.year.id,
            year: reviewGroup.year.name,
            group: reviewGroup.group,
            modules: reviewGroup.modules.map((module) => ({
                id: module.module.id,
                code: module.module.code,
                name: module.module.name,
                shortNameML: `${module.module.moduleLead.firstName[0]}. ${module.module.moduleLead.lastName}`,
                moduleLead: `${module.module.moduleLead.firstName} ${module.module.moduleLead.lastName}`,
                shortNameMT: module.module.moduleTutors.map((tutor) => `${tutor.user.firstName[0]}. ${tutor.user.lastName}`),
                moduleTutors: module.module.moduleTutors.map((tutor) => `${tutor.user.firstName} ${tutor.user.lastName}`),
            })),
            shortConvener: `${reviewGroup.convener.firstName[0]}. ${reviewGroup.convener.lastName}`,
            convener: reviewGroup.convener.id,
            convenerName: `${reviewGroup.convener.firstName} ${reviewGroup.convener.lastName}`,
        }));
        setReviewGroups(resData);
    };

    useEffect(() => {
        fetchReviewGroups();
    }, []);

    return <ReviewGroupsContext.Provider value={{ reviewGroups, fetchReviewGroups }}>{children}</ReviewGroupsContext.Provider>;
};

export const useReviewGroups = () => {
    const context = useContext(ReviewGroupsContext);
    if (!context) {
        throw new Error("useReviewGroups must be used within a ReviewGroupsProvider");
    }
    return context;
};
