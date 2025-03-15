import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";

export const prevPhaseHandler = catchErrors(async (req, res) => {
    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });

    if (!currentStatus) {
        return res.status(NOT_FOUND).json({ error: "Moderation status not found" });
    }

    let newPhaseId = currentStatus.moderationPhaseId - 1;
    if (newPhaseId < 0) {
        newPhaseId = 1;
    }
    const changeToPrevPhase = await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            moderationPhaseId: newPhaseId,
        },
    });
    return res.status(OK);
});

export const nextPhaseHandler = catchErrors(async (req, res) => {
    const maxPhaseId = await prisma.moderationPhase.count();
    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });

    if (!currentStatus) {
        return res.status(NOT_FOUND).json({ error: "Moderation status not found" });
    }

    let newPhaseId = currentStatus.moderationPhaseId + 1;
    if (newPhaseId > maxPhaseId) {
        newPhaseId = 1;
    }

    const changeToNextPhase = await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            moderationPhaseId: newPhaseId,
        },
    });

    return res.status(OK).json(changeToNextPhase);
});
