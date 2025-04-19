import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";
import { getNOfCommentsInFolder, getNOfFilesInFolder } from "../services/box-service";
import { getUserIdFromToken } from "../utils/jwt";
import { getCurrentAcademicYear } from "../services/moderation-status-service";
import { logMsg, logType } from "../utils/logger";

export const getAcademicAssessmentsHandler = catchErrors(async (req, res) => {
    return res.status(OK).json();
});
export const getCurrentACYearExams = catchErrors(async (req, res) => {
    const userId = 38;
    appAssert(userId, BAD_REQUEST, "User ID not found in request");

    const currentAcademicYear = await getCurrentAcademicYear();
    appAssert(currentAcademicYear, INTERNAL_SERVER_ERROR, "Could not determine the current academic year");

    const currentAcademicYearExams = await prisma.academicYearAssessment.findMany({
        select: {
            id: true,
            name: true,
            folderId: true,
        },
        where: {
            academicYearId: currentAcademicYear.id,
            assessmentCategoryId: 9,
        },
    });

    appAssert(currentAcademicYearExams.length > 0, NOT_FOUND, "Exam assessments not found for the current academic year");

    return res.status(OK).json(currentAcademicYearExams);
});
