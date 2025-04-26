import prisma from "../prisma/primsa-client";
import { safeExecute } from "../utils/catch-errors";
import { logMsg, logType } from "../utils/logger";
import { createBoxFolders, clearFolderContents } from "./box-service";
import { advanceModerationStatus, getCurrentAcademicYear } from "./moderation-status-service";
import { broadcastNotification, sendNotification } from "./notification-service";
import { removeModeratorRoleFromUsers } from "./review-group-service";

const POLL_INTERVAL = 1000;
let isCannotCreateBoxFolderNotificationSent = false;
let isReviewGroupsCreatedNotificationSent = false;
let isBoxfoldersAreBeingCreatedNotificationSent = false;
let assessmentsCopied = false;
let isBoxFoldersCleared = false;
let internalReviewTp1Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
let externalReviewTp1Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
let finalTp1Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
let internalReviewTp2Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
let externalReviewTp2Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
let finalTp2Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
let flagsReset = false;
let lastResetAcademicYearId: number | null = null;
let moderatorRoleRemoved = false;

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
            logMsg(logType.MODERATION, `Fetched status from DB: ${currentStatus}`);

            if (!currentStatus) {
                logMsg(logType.MODERATION, "No status found, retrying...");
                await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
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
                    logMsg(logType.MODERATION, `Unknown moderationPhaseId: ${currentStatus.moderationPhaseId}`);
            }

            updateProcessState(currentStatus);
            logMsg(logType.MODERATION, "Waiting for status change...");
            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        } catch (error: any) {
            logMsg(logType.ERROR, `Error in processModerationStatus: ${error.message}`);
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

export const getCurrentDateTime = async () => {
    if (process.env.DEMO === "true") {
        const date = await prisma.dateDemo.findFirst({
            select: {
                date: true,
            },
        });
        return date.date;
    } else if (process.env.DEMO === "false") {
        const date = new Date();
        return date;
    }
    return new Date();
};

const getIsReviewGroupsFinalized = async () => {
    return await safeExecute(async () => {
        const isFinalizedReviewGroups = await prisma.moderationStatus.findFirst({
            select: {
                finalizeReviewGroups: true,
            },
        });
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
        logMsg(logType.ERROR, `Error retrieving status from DB: ${error.message}`);
        return null;
    }
};

const isPastDate = async (date: Date) => {
    return (await getCurrentDateTime()).getTime() > date.getTime();
};

interface DeadlineNotificationState {
    notification1Sent: boolean; // 5 days before
    notification2Sent: boolean; // 2 days before
    notification3Sent: boolean; // On deadline (optional)
}

const sendDeadlineNotifications = async (deadline: Date, notificationState: DeadlineNotificationState, phaseDescription: string): DeadlineNotificationState => {
    const now = await getCurrentDateTime();
    const fiveDaysInMillis = 5 * 24 * 60 * 60 * 1000;
    const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000;

    const fiveDaysBefore = new Date(deadline.getTime() - fiveDaysInMillis);
    const twoDaysBefore = new Date(deadline.getTime() - twoDaysInMillis);

    const updatedState = { ...notificationState };

    if (!updatedState.notification1Sent && now >= fiveDaysBefore && now < deadline) {
        broadcastNotification("warning", `${phaseDescription} deadline is approaching in 5 days (${deadline.toLocaleDateString()}).`);
        updatedState.notification1Sent = true;
        logMsg(logType.MODERATION, `Sent 5-day ${phaseDescription} deadline notification.`);
    }
    if (!updatedState.notification2Sent && now >= twoDaysBefore && now < deadline) {
        broadcastNotification("warning", `${phaseDescription} deadline is approaching in 2 days (${deadline.toLocaleDateString()}).`);
        updatedState.notification2Sent = true;
        logMsg(logType.MODERATION, `Sent 2-day ${phaseDescription} deadline notification.`);
    }
    if (!updatedState.notification3Sent && now.toDateString() === deadline.toDateString()) {
        broadcastNotification("warning", `${phaseDescription} deadline is today (${deadline.toLocaleDateString()}).`);
        updatedState.notification3Sent = true;
        logMsg(logType.MODERATION, `Sent deadline day ${phaseDescription} notification.`);
    }
    return updatedState;
};

const resetFlags = async () => {
    isCannotCreateBoxFolderNotificationSent = false;
    isReviewGroupsCreatedNotificationSent = false;
    isBoxfoldersAreBeingCreatedNotificationSent = false;
    assessmentsCopied = false;
    isBoxFoldersCleared = false;
    internalReviewTp1Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
    externalReviewTp1Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
    finalTp1Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
    internalReviewTp2Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
    externalReviewTp2Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
    finalTp2Notifications = { notification1Sent: false, notification2Sent: false, notification3Sent: false };
    moderatorRoleRemoved = false;

    await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            finalizeReviewGroups: false,
            tp1DeadlinesSet: false,
            tp2DeadlinesSet: false,
        },
    });
    flagsReset = true; // Consider if this flag is still needed with the new logic
    logMsg(logType.MODERATION, "Flags and relevant DB fields reset.");
};

// Outside moderation
const handleModerationPhaseOne = async (statusData: any) => {
    try {
        logMsg(logType.MODERATION, `Processing Status ${statusData.moderationPhaseId}`);
        await removeModeratorRoleFromUsers();
        const currentAcademicYear = await getCurrentAcademicYear();
        if (!currentAcademicYear) {
            logMsg(logType.ERROR, "Could not determine current academic year in handleModerationPhaseTwo. Cannot reset flags.");
            // Depending on requirements, you might want to return or throw an error here
        } else {
            if (lastResetAcademicYearId !== currentAcademicYear.id) {
                logMsg(logType.MODERATION, `New academic year detected (ID: ${currentAcademicYear.id}). Resetting flags.`);
                await resetFlags();
                lastResetAcademicYearId = currentAcademicYear.id; // Update the tracker
            } else {
                logMsg(logType.MODERATION, `Flags already reset for academic year ID: ${currentAcademicYear.id}. Skipping reset.`);
            }
        }
        const date = await getCurrentDateTime();
        const userId = await getAssessmentLeadId();
        /* if (!isBoxFoldersCleared) {
            await clearFolderContents("0", userId);
            await prisma.academicYearAssessment.deleteMany();
            await prisma.academicYear.deleteMany();
            await prisma.er.deleteMany();
            await prisma.moderationStatus.update({
                where: {
                    id: 1,
                },
                data: {
                    finalizeReviewGroups: false,
                    erFolderId: null,
                },
            });
        }
        isBoxFoldersCleared = true; */
        const tp1StartDate = await prisma.moderationStatus.findFirst({
            select: {
                tp1StartDate: true,
            },
        });
        if (!tp1StartDate || !tp1StartDate.tp1StartDate) {
            logMsg(logType.ERROR, "tp1StartDate not found");
            return;
        }
        const tp1StartDateWithYear = new Date(tp1StartDate.tp1StartDate);
        const currentYear = (await getCurrentDateTime()).getFullYear();
        tp1StartDateWithYear.setFullYear(currentYear);
        if (await isPastDate(tp1StartDateWithYear)) {
            await broadcastNotification("info", "Moderation Phase", "Moderation phase advanced to TP 1 - Stage 1");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, `error in handleModerationPhaseOne: ${error.message}`);
    }
};

// tp 1, stage 1
const handleModerationPhaseTwo = async (statusData: any) => {
    try {
        logMsg(logType.MODERATION, `Processing Status ${statusData.moderationPhaseId}`);

        // get userid of the user who's role is assessment lead
        const isReviewGroupFinalized = await getIsReviewGroupsFinalized();
        const isTp1DeadlinesSet = await prisma.moderationStatus.findFirst({
            select: {
                tp1DeadlinesSet: true,
            },
        });
        if (!isTp1DeadlinesSet || !isTp1DeadlinesSet.tp1DeadlinesSet) {
            logMsg(logType.ERROR, "TP1 deadlines are not set");
            return;
        }
        let isboxFoldersCreated;
        const userId = await getAssessmentLeadId();

        if (!isReviewGroupFinalized || !isTp1DeadlinesSet.tp1DeadlinesSet) {
            return;
        }
        if (!isBoxfoldersAreBeingCreatedNotificationSent) {
            sendNotification(userId, "info", "BOX", "BOX folders are being created, after which the moderation phase will be advanced to TP 1 - Stage 1 - Internal Review");
            isBoxfoldersAreBeingCreatedNotificationSent = true;
        }
        if (!assessmentsCopied) {
            // Copy all assessments to AcademicYearAssessment table
            const assessments = await prisma.assessment.findMany();

            const academicYear = await getCurrentAcademicYear();

            const academicYearAssessmentData = assessments.map((assessment) => ({
                tpId: assessment.tpId,
                moduleId: assessment.moduleId,
                weight: assessment.weight,
                assessmentTypeId: assessment.assessmentTypeId,
                assessmentCategoryId: assessment.assessmentCategoryId,
                durationInMinutes: assessment.durationInMinutes,
                academicYearId: academicYear?.id,
            }));
            logMsg(logType.MODERATION, "Copying assessments to academicYearAssessments");
            const academicYearAssessments = await prisma.academicYearAssessment.createMany({
                data: academicYearAssessmentData,
            });
            assessmentsCopied = true;
        }

        // Create box folders
        isboxFoldersCreated = await createBoxFolders(userId);
        // isboxFoldersCreated is either number or null, if it is null, then the folders were not created
        if (!isboxFoldersCreated) {
            if (!isCannotCreateBoxFolderNotificationSent) {
                await sendNotification(userId, "error", "Could not create folders in box", "Box may not be connected to AMT, please connect Box to amt");
                isCannotCreateBoxFolderNotificationSent = true;
            }
        } else {
            await sendNotification(userId, "info", "Box folders created");
            await broadcastNotification("info", "Moderation Phase", "Moderation phase advanced to TP 1 - Stage 1 - Internal Review");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};

// tp 1, stage 1, internal review
const handleModerationPhaseThree = async (statusData: any) => {
    try {
        logMsg(logType.MODERATION, `Processing Status ${statusData.moderationPhaseId}`);
        if (!isReviewGroupsCreatedNotificationSent) {
            broadcastNotification("info", "Review groups have been created, please check the dashboard");
            isReviewGroupsCreatedNotificationSent = true;
        }

        const deadlineData = await prisma.moderationStatus.findFirst({
            select: {
                internalModerationDeadlineTp1: true,
            },
        });

        if (!deadlineData || !deadlineData.internalModerationDeadlineTp1) {
            logMsg(logType.ERROR, "Internal moderation deadline TP1 not found for phase 3");
            return;
        }

        const deadline = deadlineData.internalModerationDeadlineTp1;

        internalReviewTp1Notifications = await sendDeadlineNotifications(deadline, internalReviewTp1Notifications, "Internal moderation TP1");

        if (await isPastDate(deadline)) {
            await broadcastNotification("info", "Moderation Phase", "Moderation phase advanced to TP 1 - Stage 1 - External Review");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};

// tp 1, stage 1, external review
const handleModerationPhaseFour = async (statusData: any) => {
    try {
        logMsg(logType.MODERATION, `Processing Status ${statusData.moderationPhaseId}`);
        const deadlineData = await prisma.moderationStatus.findFirst({
            select: {
                externalModerationDeadlineTp1: true,
            },
        });

        if (!deadlineData || !deadlineData.externalModerationDeadlineTp1) {
            logMsg(logType.ERROR, "external moderation deadline TP1 not found for phase 4");
            return;
        }

        const deadline = deadlineData.externalModerationDeadlineTp1;

        externalReviewTp1Notifications = await sendDeadlineNotifications(deadline, externalReviewTp1Notifications, "External moderation TP1");

        if (await isPastDate(deadline)) {
            await broadcastNotification("info", "Moderation Phase", "Moderation phase advanced to TP 1 - Stage 2");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};

// tp 1, stage 2
const handleModerationPhaseFive = async (statusData: any) => {
    try {
        logMsg(logType.MODERATION, `Processing Status ${statusData.moderationPhaseId}`);
        const deadlineData = await prisma.moderationStatus.findFirst({
            select: {
                finalDeadlineTp1: true,
            },
        });

        if (!deadlineData || !deadlineData.finalDeadlineTp1) {
            logMsg(logType.ERROR, "Final deadline TP1 not found for phase 5");
            return;
        }

        const deadline = deadlineData.finalDeadlineTp1;

        finalTp1Notifications = await sendDeadlineNotifications(deadline, finalTp1Notifications, "Final TP 1");

        const currentAcademicYear = await prisma.academicYear.findFirst({
            orderBy: {
                year: "desc",
            },
            select: {
                year: true,
            },
        });
        if (!currentAcademicYear) {
            logMsg(logType.ERROR, "No academic year found");
            return;
        }
        const academicYear = currentAcademicYear.year;
        const nextYear = academicYear + 1;
        const tp2startDate = await prisma.moderationStatus.findFirst({
            select: {
                tp2StartDate: true,
            },
        });
        if (!tp2startDate || !tp2startDate.tp2StartDate) {
            logMsg(logType.ERROR, "tp2StartDate not found");
            return;
        }

        const tp2startDateWithYear = new Date(tp2startDate.tp2StartDate);
        tp2startDateWithYear.setFullYear(nextYear);
        if (await isPastDate(tp2startDateWithYear)) {
            await broadcastNotification("info", "Moderation Phase", "Moderation phase advanced to TP 2 - Stage 1");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};

// tp 2, stage 1
const handleModerationPhaseSix = async (statusData: any) => {
    try {
        logMsg(logType.MODERATION, `Processing Status ${statusData.moderationPhaseId}`);
        const isTp2DeadlinesSet = await prisma.moderationStatus.findFirst({
            select: {
                tp2DeadlinesSet: true,
            },
        });
        if (!isTp2DeadlinesSet || !isTp2DeadlinesSet.tp2DeadlinesSet) {
            logMsg(logType.ERROR, "TP2 deadlines are not set");
            return;
        }
        if (isTp2DeadlinesSet.tp2DeadlinesSet) {
            await broadcastNotification("info", "Moderation Phase", "Moderation phase advanced to TP 2 - Stage 1 - Internal Review");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};

// tp 2, stage 1, internal review
const handleModerationPhaseSeven = async (statusData: any) => {
    try {
        logMsg(logType.MODERATION, `Processing Status ${statusData.moderationPhaseId}`);

        const deadlineData = await prisma.moderationStatus.findFirst({
            select: {
                internalModerationDeadlineTp2: true,
            },
        });

        if (!deadlineData || !deadlineData.internalModerationDeadlineTp2) {
            logMsg(logType.ERROR, "Internal moderation deadline TP2 not found for phase 7");
            return;
        }

        const deadline = deadlineData.internalModerationDeadlineTp2;

        internalReviewTp2Notifications = await sendDeadlineNotifications(deadline, internalReviewTp2Notifications, "Internal moderation TP2");

        if (await isPastDate(deadline)) {
            await broadcastNotification("info", "Moderation Phase", "Moderation phase advanced to TP 2 - Stage 1 - External Review");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};

// tp 2, stage 1, external review
const handleModerationPhaseEight = async (statusData: any) => {
    try {
        logMsg(logType.MODERATION, `Processing Status ${statusData.moderationPhaseId}`);
        const deadlineData = await prisma.moderationStatus.findFirst({
            select: {
                externalModerationDeadlineTp2: true,
            },
        });

        if (!deadlineData || !deadlineData.externalModerationDeadlineTp2) {
            logMsg(logType.ERROR, "External moderation deadline TP2 not found for phase 8");
            return;
        }

        const deadline = deadlineData.externalModerationDeadlineTp2;

        externalReviewTp2Notifications = await sendDeadlineNotifications(deadline, externalReviewTp2Notifications, "External moderation TP2");

        if (await isPastDate(deadline)) {
            await broadcastNotification("info", "Moderation Phase", "Moderation phase advanced to TP 2 - Stage 2");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};

// tp 2, stage 2
const handleModerationPhaseNine = async (statusData: any) => {
    try {
        logMsg(logType.MODERATION, `Processing Status ${statusData.moderationPhaseId}`);
        const deadlineData = await prisma.moderationStatus.findFirst({
            select: {
                finalDeadlineTp2: true,
            },
        });

        if (!deadlineData || !deadlineData.finalDeadlineTp2) {
            logMsg(logType.ERROR, "Final deadline TP2 not found for phase 9");
            return;
        }

        const deadline = deadlineData.finalDeadlineTp2;

        finalTp2Notifications = await sendDeadlineNotifications(deadline, finalTp2Notifications, "Final TP 2");

        const currentAcademicYear = await prisma.academicYear.findFirst({
            orderBy: {
                year: "desc",
            },
            select: {
                year: true,
            },
        });
        if (!currentAcademicYear) {
            logMsg(logType.ERROR, "No academic year found");
            return;
        }
        const academicYear = currentAcademicYear.year;
        const nextYear = academicYear + 1;
        const tp2endDate = await prisma.moderationStatus.findFirst({
            select: {
                tp2EndDate: true,
            },
        });
        if (!tp2endDate || !tp2endDate.tp2EndDate) {
            logMsg(logType.ERROR, "tp2endDate not found");
            return;
        }

        const tp2endDateWithYear = new Date(tp2endDate.tp2EndDate);
        tp2endDateWithYear.setFullYear(nextYear);
        if (await isPastDate(tp2endDateWithYear)) {
            await broadcastNotification("info", "Moderation Phase", "Moderation phase advanced to Resit - Stage 2");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};

// resit, stage 2
const handleModerationPhaseTen = async (statusData: any) => {
    try {
        logMsg(logType.MODERATION, `Processing Status ${statusData.moderationPhaseId}`);

        const currentAcademicYear = await prisma.academicYear.findFirst({
            orderBy: {
                year: "desc",
            },
            select: {
                year: true,
            },
        });
        if (!currentAcademicYear) {
            logMsg(logType.ERROR, "No academic year found");
            return;
        }
        const academicYear = currentAcademicYear.year;
        const nextYear = academicYear + 1;
        const resitEndDate = await prisma.moderationStatus.findFirst({
            select: {
                resitEndDate: true,
            },
        });
        if (!resitEndDate || !resitEndDate.resitEndDate) {
            logMsg(logType.ERROR, "resitEndDate not found");
            return;
        }

        const resitEndDateWithYear = new Date(resitEndDate.resitEndDate);
        resitEndDateWithYear.setFullYear(nextYear);
        if (await isPastDate(resitEndDateWithYear)) {
            await broadcastNotification("info", "Moderation Phase", "Academic year had ended");
            await advanceModerationStatus();
        }
    } catch (error: any) {
        logMsg(logType.ERROR, error.message);
    }
};
const updateProcessState = async (statusData: any) => {
    logMsg(logType.MODERATION, `Status processed, updating process state for status: ${statusData.moderationPhaseId}`);
};
