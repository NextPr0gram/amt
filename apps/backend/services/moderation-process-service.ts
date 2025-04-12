import prisma from "../prisma/primsa-client";
import { safeExecute } from "../utils/catch-errors";
import { logMsg, logType } from "../utils/logger";
import { createBoxFolders } from "./box-service";
import { advanceModerationStatus } from "./moderation-status-service";
import {
    broadcastNotification,
    sendNotification,
} from "./notification-service";

const POLL_INTERVAL = 1000;
let isCannotCreateBoxFolderNotificationSent = false;
let isReviewGroupsCreatedNotificationSent = false;

export const processModerationStatus = async () => {
    logMsg(logType.MODERATION, "Starting processStatus...");
    const resetModerationStatus = await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            moderationPhaseId: 1,
        },
    });

    while (true) {
        try {
            const currentStatus = await getCurrentStatusFromDB();
            logMsg(
                logType.MODERATION,
                `Fetched status from DB: ${currentStatus}`,
            );

            if (!currentStatus) {
                logMsg(logType.MODERATION, "No status found, retrying...");
                await new Promise((resolve) =>
                    setTimeout(resolve, POLL_INTERVAL),
                );
                continue;
            }

            switch (currentStatus.moderationPhaseId) {
                case 1:
                    await handleModerationPhaseOne(currentStatus);
                    break;
                case 2:
                    await handleModerationPhaseTwo(currentStatus);
                    break;
                case 3:
                    await handleModerationPhaseThree(currentStatus);
                    break;
                case 4:
                    await handleModerationPhaseFour(currentStatus);
                    break;
                case 5:
                    await handleModerationPhaseFive(currentStatus);
                    break;
                case 6:
                    await handleModerationPhaseSix(currentStatus);
                    break;
                case 7:
                    await handleModerationPhaseSeven(currentStatus);
                    break;
                case 8:
                    await handleModerationPhaseEight(currentStatus);
                    break;
                case 9:
                    await handleModerationPhaseNine(currentStatus);
                    break;
                case 10:
                    await handleModerationPhaseTen(currentStatus);
                    break;
                default:
                    logMsg(
                        logType.MODERATION,
                        `Unknown moderationPhaseId: ${currentStatus.moderationPhaseId}`,
                    );
            }

            updateProcessState(currentStatus);
            logMsg(logType.MODERATION, "Waiting for status change...");
            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        } catch (error: any) {
            logMsg(
                logType.ERROR,
                `Error in processModerationStatus: ${error.message}`,
            );
        }
    }
};
const getAssessmentLeadId = async () => {
    return await safeExecute(async () => {
        const assessmentLead = await prisma.user.findFirst({
            where: {
                role: {
                    some: {
                        roleId: 1,
                    },
                },
            },
            select: {
                id: true,
            },
        });
        return assessmentLead?.id as number;
    }, "Could not retreive assessment lead");
};
const getIsReviewGroupsFinalized = async () => {
    return await safeExecute(async () => {
        const isFinalizedReviewGroups = await prisma.moderationStatus.findFirst(
            {
                select: {
                    finalizeReviewGroups: true,
                },
            },
        );
        return isFinalizedReviewGroups?.finalizeReviewGroups ?? false;
    }, "Error retrieving finalizeReviewGroups from DB");
};
const getCurrentStatusFromDB = async () => {
    logMsg(logType.MODERATION, "Retrieving current status from DB...");
    try {
        const moderationStatus = await prisma.moderationStatus.findFirst({
            select: {
                moderationPhaseId: true,
            },
        });
        return moderationStatus || null;
    } catch (error: any) {
        logMsg(
            logType.ERROR,
            `Error retrieving status from DB: ${error.message}`,
        );
        return null;
    }
};

const isPastDate = (date: Date) => {
    return Date.now() > date.getTime();
};

// Outside moderation
const handleModerationPhaseOne = async (statusData: any) => {
    try {
        logMsg(
            logType.MODERATION,
            `Processing Status ${statusData.moderationPhaseId}`,
        );
        const date = new Date("2025-03-24T01:56:00Z");

        // if (isPastDate(date)) {
        //     await advanceModerationStatus();
        // }
    } catch (error) {
        logMsg(logType.ERROR, "custom error");
    }
};

// tp 1, stage 1
const handleModerationPhaseTwo = async (statusData: any) => {
    try {
        logMsg(
            logType.MODERATION,
            `Processing Status ${statusData.moderationPhaseId}`,
        );
        // get userid of the user who's role is assessment lead
        const isReviewGroupFinalized = await getIsReviewGroupsFinalized();
        let isboxFoldersCreated;
        const userId = await getAssessmentLeadId();

        if (!isReviewGroupFinalized) {
            return;
        }

        // Copy all assessments to AcademicYearAssessment table
        const assessments = await prisma.assessment.findMany();

        const academicYear = new Date().getFullYear() as number;

        const newAcademicYear = await prisma.academicYear.create({
            data: {
                year: academicYear,
            },
        });

        const academicYearAssessmentData = assessments.map((assessment) => ({
            tpId: assessment.tpId,
            moduleId: assessment.moduleId,
            weight: assessment.weight,
            assessmentTypeId: assessment.assessmentTypeId,
            assessmentCategoryId: assessment.assessmentCategoryId,
            durationInMinutes: assessment.durationInMinutes,
            academicYearId: newAcademicYear?.id,
        }));
        logMsg(
            logType.MODERATION,
            "Copying assessments to academicYearAssessments",
        );
        const academicYearAssessments =
            await prisma.academicYearAssessment.createMany({
                data: academicYearAssessmentData,
            });

        // Create box folders
        isboxFoldersCreated = await createBoxFolders(userId);

        if (!isboxFoldersCreated) {
            if (!isCannotCreateBoxFolderNotificationSent) {
                await sendNotification(
                    userId,
                    "error",
                    "Could not create folders in box",
                    "Box may not be connected to AMT, please connect Box to amt",
                );
                isCannotCreateBoxFolderNotificationSent = true;
            }
        } else {
            await sendNotification(userId, "info", "Box folders created");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};

// tp 1, stage 1, internal review
const handleModerationPhaseThree = async (statusData: any) => {
    try {
        logMsg(
            logType.MODERATION,
            `Processing Status ${statusData.moderationPhaseId}`,
        );
        if (!isReviewGroupsCreatedNotificationSent) {
            broadcastNotification(
                "info",
                "Review groups have been created, please check the dashboard",
            );
            isReviewGroupsCreatedNotificationSent = true;
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};

// tp 1, stage 1, external review
const handleModerationPhaseFour = async (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Processing Status ${statusData.moderationPhaseId}`,
    );
};

// tp 1, stage 2
const handleModerationPhaseFive = async (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Processing Status ${statusData.moderationPhaseId}`,
    );
};

// tp 2, stage 1
const handleModerationPhaseSix = async (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Processing Status ${statusData.moderationPhaseId}`,
    );
};

// tp 2, stage 1, internal review
const handleModerationPhaseSeven = async (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Processing Status ${statusData.moderationPhaseId}`,
    );
};

// tp 2, stage 1, external review
const handleModerationPhaseEight = async (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Processing Status ${statusData.moderationPhaseId}`,
    );
};

// tp 2, stage 2
const handleModerationPhaseNine = async (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Processing Status ${statusData.moderationPhaseId}`,
    );
};

// resit, stage 2
const handleModerationPhaseTen = async (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Processing Status ${statusData.moderationPhaseId}`,
    );
};
const updateProcessState = async (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Status processed, updating process state for status: ${statusData.moderationPhaseId}`,
    );
};
