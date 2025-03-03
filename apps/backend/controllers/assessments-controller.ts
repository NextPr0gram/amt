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
