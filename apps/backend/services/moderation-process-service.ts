/*
data: [
none
{
    tPId: 4,
    stageId: 3,
    reviewTypeId: 3,
    triggerId: 1,
},
tp 1, stage 1, no review
    {
        tPId: 1,
        stageId: 1,
        reviewTypeId: 3,
        triggerId: 1
    },

tp 1, stage 1 , internal review
    {
        tPId: 1,
        stageId: 1,
        reviewTypeId: 1,
        triggerId: 2
    },
    
tp 1, stage 1, external review
    {
        tPId: 1,
        stageId: 1,
        reviewTypeId: 2,
        triggerId: 3
    },

tp 1, stage 2, no review
    {
        tPId: 1,
        stageId: 2,
        reviewTypeId: 3,
        triggerId: 1
    },

tp 2, stage 1, no review
    {
        tPId: 2,
        stageId: 1,
        reviewTypeId: 3,
        triggerId: 1
    },

tp 2, stage 1, internal review
    {
        tPId: 2,
        stageId: 1,
        reviewTypeId: 1,
        triggerId: 2
    },

tp 2, stage 1, external review
    {
        tPId: 2,
        stageId: 1,
        reviewTypeId: 2,
        triggerId: 3
    },
tp 2, stage 2, no review
    {
        tPId: 2,
        stageId: 2,
        reviewTypeId: 3,
        triggerId: 1
    },
resit, stage 2, no reivew
    {
        tPId: 3,
        stageId: 2,
        reviewTypeId: 3,
        triggerId: 1
    },
]
*/
import prisma from "../prisma/primsa-client";
import { logMsg, logType } from "../utils/logger";
import { advanceModerationStatus } from "./moderation-status-service";

const POLL_INTERVAL = 1000;

export const processModerationStatus = async () => {
    logMsg(logType.MODERATION, "Starting processStatus...");

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
                    await handleStatusOne(currentStatus);
                    break;
                case 2:
                    handleStatusTwo(currentStatus);
                    break;
                case 3:
                    handleStatusThree(currentStatus);
                    break;
                case 4:
                    handleStatusFour(currentStatus);
                    break;
                case 5:
                    handleStatusFive(currentStatus);
                    break;
                case 6:
                    handleStatusSix(currentStatus);
                    break;
                case 7:
                    handleStatusSeven(currentStatus);
                    break;
                case 8:
                    handleStatusEight(currentStatus);
                    break;
                case 9:
                    handleStatusNine(currentStatus);
                    break;
                case 10:
                    handleStatusTen(currentStatus);
                    break;
                default:
                    logMsg(
                        logType.MODERATION,
                        `Unknown moderationPhaseId: ${currentStatus.moderationPhaseId}`,
                    );
            }

            updateProcessState(currentStatus);
            logMsg(logType.MODERATION, "Waiting for status change...");
            // currentStatus = await pollForStatusChange(currentStatus);
            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        } catch (error: any) {
            logMsg(
                logType.ERROR,
                `Error in processModerationStatus: ${error.message}`,
            );
        }
    }
};

const pollForStatusChange = async (currentStatus: any) => {
    logMsg(logType.MODERATION, "Entering pollForStatusChange...");
    while (true) {
        try {
            logMsg(logType.MODERATION, "Polling database for status update...");
            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
            const updatedStatus = await getCurrentStatusFromDB();

            if (hasStatusChanged(currentStatus, updatedStatus)) {
                logMsg(logType.MODERATION, "Change detected in status.");
                return updatedStatus;
            }
            logMsg(
                logType.MODERATION,
                "No change detected, continuing to poll...",
            );
        } catch (error: any) {
            logMsg(
                logType.ERROR,
                `Error in pollForStatusChange: ${error.message}`,
            );
        }
    }
};

export const hasStatusChanged = (
    currentStatus: any,
    updatedStatus: any,
): boolean => {
    return currentStatus.id !== updatedStatus.is;
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

const handleStatusOne = async (statusData: any) => {
    logMsg(logType.MODERATION, `Processing Status ${statusData.id}`);
    const date = new Date("2025-03-24T01:56:00Z");
    if (isPastDate(date)) {
        await advanceModerationStatus();
    }
};

const handleStatusTwo = (statusData: any) => {
    logMsg(logType.MODERATION, `Processing Status ${statusData.id}`);
};

const handleStatusThree = (statusData: any) => {
    logMsg(logType.MODERATION, `Processing Status ${statusData.id}`);
};

const handleStatusFour = (statusData: any) => {
    logMsg(logType.MODERATION, `Processing Status ${statusData.id}`);
};

const handleStatusFive = (statusData: any) => {
    logMsg(logType.MODERATION, `Processing Status ${statusData.id}`);
};

const handleStatusSix = (statusData: any) => {
    logMsg(logType.MODERATION, `Processing Status ${statusData.id}`);
};

const handleStatusSeven = (statusData: any) => {
    logMsg(logType.MODERATION, `Processing Status ${statusData.id}`);
};

const handleStatusEight = (statusData: any) => {
    logMsg(logType.MODERATION, `Processing Status ${statusData.id}`);
};

const handleStatusNine = (statusData: any) => {
    logMsg(logType.MODERATION, `Processing Status ${statusData.id}`);
};

const handleStatusTen = (statusData: any) => {
    logMsg(logType.MODERATION, `Processing Status ${statusData.id}`);
};
const updateProcessState = (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Status processed, updating process state for status: ${statusData.id}`,
    );
};
