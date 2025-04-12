"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { protectedFetch } from "@/utils/protected-fetch";

export type Assessment = {
    id: number;
    tpId: number;
    tpName: string;
    moduleId: number;
    moduleCode: string;
    moduleName: string;
    assessmentTypeId: number;
    assessmentType: string;
    assessmentCategoryId: number;
    assessmentCategory: string;
    weight: number;
    releaseDate?: string;
    submissionDate?: string;
    durationInMinutes?: number;
};

type AssessmentAPIResponse = {
    id: number;
    tp: {
        id: number;
        name: string;
    }
    module: {
        id: number;
        code: string;
        name: string;
    };
    assessmentType: {
        id: number;
        name: string;
    };
    assessmentCategory: {
        id: number;
        name: string;
    };
    weight: number;
    durationInMinutes: number;
};

type AssessmentsContextType = {
    assessments: Assessment[];
    fetchAssessments: () => void;
};

const AssessmentsContext = createContext<AssessmentsContextType | undefined>(undefined);

export const AssessmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [assessments, setAssessments] = useState<Assessment[]>([]);

    const fetchAssessments = async () => {
        const res = await protectedFetch("/assessments", "GET");
        const resData = res.data.map((assessment: AssessmentAPIResponse) => ({
            id: assessment.id,
            tpId: assessment.tp.id,
            tpName: assessment.tp.name,
            moduleId: assessment.module.id,
            moduleCode: assessment.module.code,
            moduleName: assessment.module.name,
            assessmentTypeId: assessment.assessmentType.id,
            assessmentType: assessment.assessmentType.name,
            assessmentCategoryId: assessment.assessmentCategory.id,
            assessmentCategory: assessment.assessmentCategory.name,
            weight: assessment.weight,
            durationInMinutes: assessment.durationInMinutes,
        }));
        setAssessments(resData);
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    return <AssessmentsContext.Provider value={{ assessments, fetchAssessments }}>{children}</AssessmentsContext.Provider>;
};

export const useAssessments = () => {
    const context = useContext(AssessmentsContext);
    if (!context) {
        throw new Error("useAssessments must be used within a AssessmentsProvider");
    }
    return context;
};
