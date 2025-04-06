import { z } from "zod";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";

export const getAssessmentsHandler = catchErrors(async (req, res) => {
    const assessments = await prisma.assessment.findMany({
        select: {
            id: true,
            tp: {
                select: {
                    id: true,
                    name: true,
                },
            },
            module: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                },
            },
            assessmentType: {
                select: {
                    id: true,
                    name: true,
                },
            },
            assessmentCategory: {
                select: {
                    id: true,
                    name: true,
                },
            },
            weight: true,
            durationInMinutes: true,
        },
    });
    appAssert(assessments, NOT_FOUND, "Years not found");
    return res.status(OK).json(assessments);
});

export const updateAssessmentsHandler = catchErrors(async (req, res) => {
    const {
        id,
        tpId,
        moduleId,
        typeId,
        categoryId,
        weight,
        durationInMinutes,
    } = assessmentSchemaWithId.parse(req.body);
    const assessment = await prisma.assessment.update({
        where: {
            id,
        },
        data: {
            tpId,
            moduleId,
            assessmentTypeId: typeId,
            assessmentCategoryId: categoryId,
            weight,
            durationInMinutes,
        },
    });
    appAssert(
        assessment,
        INTERNAL_SERVER_ERROR,
        "Something went wrong while updating assessment",
    );
    return res.status(OK).json(assessment);
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
    appAssert(
        assessmentCategories,
        NOT_FOUND,
        "Assessment categories not found",
    );
    return res.status(OK).json(assessmentCategories);
});

const assessmentSchema = z.object({
    tpId: z.union([z.literal(1), z.literal(2), z.literal(5)]),
    moduleId: z.number().int(),
    typeId: z.number().int(),
    categoryId: z.number().int(),
    weight: z.number(),
    releaseDate: z.date().optional(),
    submissionDate: z.date().optional(),
    durationInMinutes: z.number().int().optional(),
});

const assessmentSchemaWithId = z.object({
    id: z.number().int(),
    tpId: z.union([z.literal(1), z.literal(2), z.literal(5)]),
    moduleId: z.number().int(),
    typeId: z.number().int(),
    categoryId: z.number().int(),
    weight: z.number(),
    releaseDate: z.date().optional(),
    submissionDate: z.date().optional(),
    durationInMinutes: z.number().int().optional(),
});

export const createAssessmentHandler = catchErrors(async (req, res) => {
    const { tpId, moduleId, typeId, categoryId, weight, durationInMinutes } =
        assessmentSchema.parse(req.body);
    const assessment = await prisma.assessment.create({
        data: {
            tpId,
            moduleId,
            assessmentTypeId: typeId,
            assessmentCategoryId: categoryId,
            weight,
            durationInMinutes,
        },
    });
    return res.status(OK).json(assessment);
});
