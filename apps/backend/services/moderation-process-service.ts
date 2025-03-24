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
    logMsg(
        logType.MODERATION,
        `Processing Status ${statusData.moderationPhaseId}`,
    );
    const date = new Date("2025-03-24T01:56:00Z");
    if (isPastDate(date)) {
        await advanceModerationStatus();
    }
};

// tp 1, stage 1
const handleModerationPhaseTwo = async (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Processing Status ${statusData.moderationPhaseId}`,
    );
};

// tp 1, stage 1, internal review
const handleModerationPhaseThree = async (statusData: any) => {
    logMsg(
        logType.MODERATION,
        `Processing Status ${statusData.moderationPhaseId}`,
    );
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
