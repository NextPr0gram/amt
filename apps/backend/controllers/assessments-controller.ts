import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";

export const getAssessmentsHandler = catchErrors(async (req, res) => {
    const assessments = await prisma.assessment.findMany({
        select: {
            id: true,
            tp: true,
            module: {
                select: {
                    code: true,
                    name: true,
                },
            },
            assessmentType: {
                select: {
                    name: true,
                },
            },
            assessmentCategory: {
                select: {
                    name: true,
                },
            },
            weight: true,
            releaseDate: true,
            submissionDate: true,
            durationInMinutes: true,
        },
    });
    appAssert(assessments, NOT_FOUND, "Years not found");
    return res.status(OK).json(assessments);
});

export const getAssessmentTypesHandler = catchErrors(async (req, res) => {
    const assessmentTypes = await prisma.assessmentType.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    appAssert(assessmentTypes, NOT_FOUND, "Assessment types not found");
    return res.status(OK).json(assessmentTypes);
});

export const getAssessmentCategoriesHandler = catchErrors(async (req, res) => {
    const assessmentCategories = await prisma.assessmentCategory.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    appAssert(assessmentCategories, NOT_FOUND, "Assessment categories not found");
    return res.status(OK).json(assessmentCategories);
});

const assessmentSchema = z.object({
    moduleId: z.number().int(),
    typeId: z.number().int(),
    categoryId: z.number().int(),
    weight: z.number(),
    releaseDate: z.date().optional(),
    submissionDate: z.date().optional(),
    durationInMinutes: z.number().int().optional(),
});

export const createAssessmentHandler = catchErrors(async (req, res) => {
    const { moduleId, typeId, categoryId, weight, releaseDate, submissionDate, durationInMinutes } = assessmentSchema.parse(req.body);
    const assessment = await prisma.assessment.create({
        data: {
            moduleId,
            assessmentTypeId: typeId,
            assessmentCategoryId: categoryId,
            weight,
            releaseDate,
            submissionDate,
            durationInMinutes,
        },
    });
    return res.status(OK).json(assessment);
});
