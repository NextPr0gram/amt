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

    const assessmentsWithCounts = [];

    logMsg(logType.SERVER, `Starting sequential processing for ${currentAcademicYearExams.length} assessments.`);
    for (const exam of currentAcademicYearExams) {
        logMsg(logType.SERVER, `Processing assessment ${exam.id} (${exam.name}) sequentially.`);

        if (!exam.folderId) {
            console.warn(`Assessment ${exam.id} (${exam.name}) is missing a folderId. Skipping Box calls.`);
            assessmentsWithCounts.push({
                assessmentId: exam.id,
                assessmentName: exam.name,
                folderId: exam.folderId || null,
                numberOfFiles: 0,
            });
            continue;
        }

        try {
            logMsg(logType.BOX, `Fetching file count for assessment ${exam.id}, folder ${exam.folderId}`);
            const numberOfFiles = await getNOfFilesInFolder(userId, exam.folderId);

            logMsg(logType.SERVER, `Successfully processed assessment ${exam.id}. Files: ${numberOfFiles}`);
            assessmentsWithCounts.push({
                assessmentId: exam.id,
                assessmentName: exam.name,
                folderId: exam.folderId,
                numberOfFiles: numberOfFiles,
            });
        } catch (error) {
            console.error(`Error fetching Box data sequentially for assessment ${exam.id} (folder: ${exam.folderId}):`, error);
            assessmentsWithCounts.push({
                assessmentId: exam.id,
                assessmentName: exam.name,
                folderId: exam.folderId,
                numberOfFiles: -1,
            });
        }
    }

    return res.status(OK).json(assessmentsWithCounts);
});
