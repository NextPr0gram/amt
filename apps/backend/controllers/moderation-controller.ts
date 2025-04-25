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

    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });
    appAssert(currentStatus, NOT_FOUND, "Moderation status not found");

    const newDate = new Date(deadlineDate);
    const externalDeadline = new Date(currentStatus.externalModerationDeadlineTp1);

    appAssert(newDate <= externalDeadline, 400, "Internal moderation deadline must be before or equal to external moderation deadline");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            internalModerationDeadlineTp1: newDate,
        },
    });

    return res.status(OK).json(updatedStatus);
});

export const updateExternalModerationDeadlineTp1Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });
    appAssert(currentStatus, NOT_FOUND, "Moderation status not found");

    const newDate = new Date(deadlineDate);
    const internalDeadline = new Date(currentStatus.internalModerationDeadlineTp1);
    const finalDeadline = new Date(currentStatus.finalDeadlineTp1);

    appAssert(internalDeadline <= newDate, 400, "External moderation deadline must be after or equal to internal moderation deadline");

    appAssert(newDate <= finalDeadline, 400, "External moderation deadline must be before or equal to final deadline");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            externalModerationDeadlineTp1: newDate,
        },
    });

    return res.status(OK).json(updatedStatus);
});

export const updateFinalDeadlineTp1Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });
    appAssert(currentStatus, NOT_FOUND, "Moderation status not found");

    const newDate = new Date(deadlineDate);
    const externalDeadline = new Date(currentStatus.externalModerationDeadlineTp1);

    appAssert(externalDeadline <= newDate, 400, "Final deadline must be after or equal to external moderation deadline");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            finalDeadlineTp1: newDate,
        },
    });

    return res.status(OK).json(updatedStatus);
});

export const updateInternalModerationDeadlineTp2Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });
    appAssert(currentStatus, NOT_FOUND, "Moderation status not found");

    const newDate = new Date(deadlineDate);
    const externalDeadline = new Date(currentStatus.externalModerationDeadlineTp2);

    appAssert(newDate <= externalDeadline, 400, "Internal moderation deadline must be before or equal to external moderation deadline");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            internalModerationDeadlineTp2: newDate,
        },
    });

    return res.status(OK).json(updatedStatus);
});

export const updateExternalModerationDeadlineTp2Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });
    appAssert(currentStatus, NOT_FOUND, "Moderation status not found");

    const newDate = new Date(deadlineDate);
    const internalDeadline = new Date(currentStatus.internalModerationDeadlineTp2);
    const finalDeadline = new Date(currentStatus.finalDeadlineTp2);

    appAssert(internalDeadline <= newDate, 400, "External moderation deadline must be after or equal to internal moderation deadline");

    appAssert(newDate <= finalDeadline, 400, "External moderation deadline must be before or equal to final deadline");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            externalModerationDeadlineTp2: newDate,
        },
    });

    return res.status(OK).json(updatedStatus);
});

export const updateFinalDeadlineTp2Handler = catchErrors(async (req, res) => {
    const { deadlineDate } = req.body;
    appAssert(deadlineDate, 400, "Deadline date is required");

    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });
    appAssert(currentStatus, NOT_FOUND, "Moderation status not found");

    const newDate = new Date(deadlineDate);
    const externalDeadline = new Date(currentStatus.externalModerationDeadlineTp2);

    appAssert(externalDeadline <= newDate, 400, "Final deadline must be after or equal to external moderation deadline");

    const updatedStatus = await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            finalDeadlineTp2: newDate,
        },
    });

    return res.status(OK).json(updatedStatus);
});
