import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";
import { getNOfCommentsInFolder, getNOfFilesInFolder } from "../services/box-service";
import { getUserIdFromToken } from "../utils/jwt";
import { getCurrentAcademicYear } from "../services/moderation-status-service";
import { logMsg, logType } from "../utils/logger";
import AppErrorCode from "../constants/app-error-code";

export const getAcademicAssessmentsHandler = catchErrors(async (req, res) => {
    return res.status(OK).json();
});
export const getCurrentACYearExamsHandler = catchErrors(async (req, res) => {
    const isModerationPhase4 = await prisma.moderationStatus.findFirst({
        select: {
            moderationPhaseId: true,
        },
    });
    appAssert(isModerationPhase4, NOT_FOUND, "Could not retrieve assessments becuse it is not external review phase yet");
    if (!(isModerationPhase4.moderationPhaseId >= 4)) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "Canot retrieve assessments because it is not external review phase yet",
            code: AppErrorCode.NotExternalReview,
        });
    }
    const userId = getUserIdFromToken(req.cookies.accessToken);
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
            sentToEr: false,
        },
    });

    appAssert(currentAcademicYearExams.length > 0, NOT_FOUND, "Exam assessments not found for the current academic year");

    return res.status(OK).json(currentAcademicYearExams);
});

export const getCurrentACYearExamsTp1Handler = catchErrors(async (req, res) => {
    const isModerationPhase4 = await prisma.moderationStatus.findFirst({
        select: {
            moderationPhaseId: true,
        },
    });
    appAssert(isModerationPhase4, NOT_FOUND, "Could not retrieve assessments becuse it is not external review phase yet");
    if (!(isModerationPhase4.moderationPhaseId >= 4)) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "Canot retrieve assessments because it is not external review phase yet",
            code: AppErrorCode.NotExternalReview,
        });
    }
    const userId = getUserIdFromToken(req.cookies.accessToken);
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
            sentToEr: false,
            tpId: 1,
        },
    });

    appAssert(currentAcademicYearExams.length > 0, NOT_FOUND, "Exam assessments not found for the current academic year");

    return res.status(OK).json(currentAcademicYearExams);
});

export const getCurrentACYearExamsTp2Handler = catchErrors(async (req, res) => {
    const isModerationPhase4 = await prisma.moderationStatus.findFirst({
        select: {
            moderationPhaseId: true,
        },
    });
    appAssert(isModerationPhase4, NOT_FOUND, "Could not retrieve assessments becuse it is not external review phase yet");
    if (!(isModerationPhase4.moderationPhaseId >= 4)) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "Canot retrieve assessments because it is not external review phase yet",
            code: AppErrorCode.NotExternalReview,
        });
    }
    const userId = getUserIdFromToken(req.cookies.accessToken);
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
            sentToEr: false,
            tpId: 2,
        },
    });

    appAssert(currentAcademicYearExams.length > 0, NOT_FOUND, "Exam assessments not found for the current academic year");

    return res.status(OK).json(currentAcademicYearExams);
});
