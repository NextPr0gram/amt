"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { protectedFetch } from "@/utils/protected-fetch";

export type Assessment = {
    id: number;
    code: string;
    name: string;
    year: string;
    yearId: number;
    lead: string;
    leadId: number | undefined;
    assessmentTutorIds: number[];
};

type AssessmentAPIResponse = {
    id: number;
    code: string;
    name: string;
    year: {
        id: number;
        name: string;
    };
    assessmentLead: {
        id: number;
        firstName: string;
        lastName: string;
    };
    assessmentTutors: {
        userId: number;
    }[];
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
            code: assessment.code,
            name: assessment.name,
            year: assessment.year.name,
            yearId: assessment.year.id,
            lead: assessment.assessmentLead ? `${assessment.assessmentLead.firstName} ${assessment.assessmentLead.lastName}` : null,
            leadId: assessment.assessmentLead.id,
            assessmentTutorIds: assessment.assessmentTutors.map((tutor) => tutor.userId),
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
