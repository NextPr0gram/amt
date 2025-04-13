import { z } from "zod";
import {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    OK,
} from "../constants/http";
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
    const parsed = assessmentSchemaWithId.parse(req.body);
    const {
        id,
        tpId,
        moduleId,
        typeId,
        categoryId,
        weight,
        durationInMinutes,
    } = parsed;
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
            durationInMinutes: parsed.hasOwnProperty("durationInMinutes")
                ? durationInMinutes
                : null,
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

    // Check TpID is in module
    const moduleTps = await prisma.module.findUnique({
        where: {
            id: moduleId,
        },
        select: {
            tps: {
                select: {
                    tpId: true,
                },
            },
        },
    });

    appAssert(moduleTps, NOT_FOUND, "module not found");

    const isModuleTp = moduleTps.tps.some((tp) => tp.tpId === tpId);

    appAssert(isModuleTp, BAD_REQUEST, "tpId is not part of the module");

    // Check Weight
    const assessments = await prisma.assessment.findMany({
        where: {
            moduleId,
        },
        select: {
            weight: true,
        },
    });

    const totalWeight = assessments
        ? assessments.reduce((sum, a) => sum + a.weight, 0)
        : 0;
    const remainingWeight = 100 - totalWeight * 100;

    appAssert(
        !(remainingWeight <= 0),
        INTERNAL_SERVER_ERROR,
        "Remaining weight is below 0",
    );

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

const getRemainingAssessmentWeightsSchema = z.object({
    moduleId: z.coerce.number().int(),
});
export const getRemainingAssessmentWeightsHandler = catchErrors(
    async (req, res) => {
        const { moduleId } = getRemainingAssessmentWeightsSchema.parse(
            req.query,
        );

        const assessments = await prisma.assessment.findMany({
            where: {
                moduleId,
            },
            select: {
                weight: true,
            },
        });

        const totalWeight = assessments
            ? assessments.reduce((sum, a) => sum + a.weight, 0)
            : 0;
        const remainingWeight = 100 - totalWeight * 100;

        appAssert(
            !(remainingWeight < 0),
            INTERNAL_SERVER_ERROR,
            "Remaining weight is below 0",
        );

        return res.status(OK).json({ remainingWeight });
    },
);
