import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";

export const getModerationStatusHandler = catchErrors(async (req, res) => {
    const moderationStatus = await prisma.moderationStatus.findFirst({
        where: {
            id: 1,
        },
        select: {
            moderationPhase: {
                select: {
                    tP: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    stage: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    reviewType: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            internalModerationDeadlineTp1: true,
            externalModerationDeadlineTp1: true,
            finalDeadlineTp1: true,
            internalModerationDeadlineTp2: true,
            externalModerationDeadlineTp2: true,
            finalDeadlineTp2: true,
        },
    });

    appAssert(moderationStatus, NOT_FOUND, "Moderation status not found");

    return res.status(OK).json(moderationStatus);
});

export const getTpsHandler = catchErrors(async (req, res) => {
    const tps = await prisma.TP.findMany({
        where: {
            id: {
                in: [1, 2],
            },
        },
        select: {
            id: true,
            name: true,
        },
    });

    appAssert(tps, NOT_FOUND, "Could not find tps");

    return res.status(OK).json(tps);
});

export const updateInternalModerationDeadlineTp1Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1, // Assuming we're updating the first moderation status
        },
        data: {
            internalModerationDeadlineTp1: new Date(deadlineDate),
        },
    });

    appAssert(updatedStatus, NOT_FOUND, "Moderation status not found");
    return res.status(OK).json(updatedStatus);
});

export const updateExternalModerationDeadlineTp1Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1, // Assuming we're updating the first moderation status
        },
        data: {
            externalModerationDeadlineTp1: new Date(deadlineDate),
        },
    });

    appAssert(updatedStatus, NOT_FOUND, "Moderation status not found");
    return res.status(OK).json(updatedStatus);
});

export const updateFinalDeadlineTp1Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1, // Assuming we're updating the first moderation status
        },
        data: {
            finalDeadlineTp1: new Date(deadlineDate),
        },
    });

    appAssert(updatedStatus, NOT_FOUND, "Moderation status not found");
    return res.status(OK).json(updatedStatus);
});

export const updateInternalModerationDeadlineTp2Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1, // Assuming we're updating the first moderation status
        },
        data: {
            internalModerationDeadlineTp2: new Date(deadlineDate),
        },
    });

    appAssert(updatedStatus, NOT_FOUND, "Moderation status not found");
    return res.status(OK).json(updatedStatus);
});

export const updateExternalModerationDeadlineTp2Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1, // Assuming we're updating the first moderation status
        },
        data: {
            externalModerationDeadlineTp2: new Date(deadlineDate),
        },
    });

    appAssert(updatedStatus, NOT_FOUND, "Moderation status not found");
    return res.status(OK).json(updatedStatus);
});

export const updateFinalDeadlineTp2Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1, // Assuming we're updating the first moderation status
        },
        data: {
            finalDeadlineTp2: new Date(deadlineDate),
        },
    });

    appAssert(updatedStatus, NOT_FOUND, "Moderation status not found");
    return res.status(OK).json(updatedStatus);
});
