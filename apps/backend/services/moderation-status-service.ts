import { Response } from "express";
import { NOT_FOUND } from "../constants/http";
import prisma from "../prisma/primsa-client";
import { io } from "../server";
import { logMsg, logType } from "../utils/logger";

// update all clients via websocket
export const updateClients = async () => {
    io.emit("moderationStatus");
    logMsg(logType.WEBSOCKET, `update clients on moderation status`);
};

export const moveToPreviousModerationStatus = async () => {
    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });

    if (!currentStatus) {
        throw new Error("Moderation status not found");
    }

    let newPhaseId = currentStatus.moderationPhaseId - 1;
    if (newPhaseId < 1) {
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

    updateClients();
    return changeToPrevPhase;
};
export const advanceModerationStatus = async () => {
    const maxPhaseId = await prisma.moderationPhase.count();
    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });

    if (!currentStatus) {
        throw new Error("Moderation status not found");
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
    updateClients();
    return changeToNextPhase;
};
