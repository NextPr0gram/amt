/*
data: [
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

const POLL_INTERVAL = 1000;

export const processModerationStatus = async () => {
    console.log("[MODERATION SERVICE] Starting processStatuss...");
    let currentStatus = await getCurrentStatusFromDB();
    console.log("[MODERATION SERVICE] Initial status from DB:", currentStatus);

    while (currentStatus) {
        console.log("[MODERATION SERVICE] Processing status:", currentStatus);
        switch (currentStatus.id) {
            case 1:
                handleStatusOne(currentStatus);
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
            default:
                console.error(
                    `Unknown statusId encountered: ${currentStatus.id}`,
                );
                break;
        }

        updateProcessState(currentStatus);

        console.log("[MODERATION SERVICE] Waiting for status change...");
        currentStatus = await pollForStatusChange(currentStatus);
        console.log(
            "[MODERATION SERVICE] Detected new status from DB:",
            currentStatus,
        );
        await new Promise((resolve) => setImmediate(resolve));
    }
    console.log(
        "[MODERATION SERVICE] No more statuss to process. Exiting processStatuss.",
    );
};

const pollForStatusChange = async (currentStatus: any) => {
    console.log("[MODERATION SERVICE] Entering pollForStatusChange...");
    while (true) {
        console.log(
            "[MODERATION SERVICE] Polling database for status update...",
        );
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        const updatedStatus = await getCurrentStatusFromDB();
        console.log(
            "[MODERATION SERVICE] Fetched updated status:",
            updatedStatus,
        );
        if (hasStatusChanged(currentStatus, updatedStatus)) {
            console.log("[MODERATION SERVICE] Change detected in status.");
            return updatedStatus;
        }
        console.log(
            "[MODERATION SERVICE] No change detected, continuing to poll...",
        );
    }
};

export const hasStatusChanged = (
    currentStatus: any,
    updatedStatus: any,
): boolean => {
    return currentStatus.id !== updatedStatus.is;
};

const getCurrentStatusFromDB = async () => {
    console.log("[MODERATION SERVICE] Retrieving current status from DB...");
    /*     model ModerationStatus {
    id           Int          @id @default(autoincrement())
    tPId         Int
    stageId      Int
    reviewTypeId Int
    triggerId    Int
    tP           TP           @relation(fields: [tPId], references: [id])
    stage        Stage        @relation(fields: [stageId], references: [id])
    reviewType   ReviewType   @relation(fields: [reviewTypeId], references: [id])
    trigger      StatusTrigger @relation(fields: [triggerId], references: [id])

    ModerationStatus ModerationStatus[]
} */
    const moderationStatus = await prisma.moderationStatus.findFirst({
        select: {
            moderationPhase: true,
        },
    });

    return moderationStatus?.moderationPhase;
};

const handleStatusOne = (statusData: any) => {
    console.log(
        "[MODERATION SERVICE] Processing Status 1 with data:",
        statusData,
    );
};

const handleStatusTwo = (statusData: any) => {
    console.log(
        "[MODERATION SERVICE] Processing Status 2 with data:",
        statusData,
    );
};

const handleStatusThree = (statusData: any) => {
    console.log(
        "[MODERATION SERVICE] Processing Status 2 with data:",
        statusData,
    );
};

const handleStatusFour = (statusData: any) => {
    console.log(
        "[MODERATION SERVICE] Processing Status 2 with data:",
        statusData,
    );
};

const handleStatusFive = (statusData: any) => {
    console.log(
        "[MODERATION SERVICE] Processing Status 2 with data:",
        statusData,
    );
};

const handleStatusSix = (statusData: any) => {
    console.log(
        "[MODERATION SERVICE] Processing Status 2 with data:",
        statusData,
    );
};

const handleStatusSeven = (statusData: any) => {
    console.log(
        "[MODERATION SERVICE] Processing Status 2 with data:",
        statusData,
    );
};

const handleStatusEight = (statusData: any) => {
    console.log(
        "[MODERATION SERVICE] Processing Status 2 with data:",
        statusData,
    );
};

const handleStatusNine = (statusData: any) => {
    console.log(
        "[MODERATION SERVICE] Processing Status 2 with data:",
        statusData,
    );
};

const updateProcessState = (statusData: any) => {
    console.log(
        "[MODERATION SERVICE] Status processed, updating process state for:",
        statusData,
    );
};
