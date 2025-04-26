import { Response } from "express";
import { NOT_FOUND } from "../constants/http";
import prisma from "../prisma/primsa-client";
import { io } from "../server";
import { logMsg, logType } from "../utils/logger";
import { getCurrentDateTime } from "./moderation-process-service";

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

export const getCurrentAcademicYear = async () => {
    const now = await getCurrentDateTime();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let academicYearStartYear: number;

    if (currentMonth >= 8) {
        academicYearStartYear = currentYear;
    } else {
        // January to August
        academicYearStartYear = currentYear - 1;
    }

    try {
        let academicYearRecord = await prisma.academicYear.findFirst({
            where: {
                year: academicYearStartYear,
            },
        });

        if (!academicYearRecord) {
            logMsg(logType.MODERATION, `Academic year ${academicYearStartYear} not found, creating it.`);
            academicYearRecord = await prisma.academicYear.create({
                data: {
                    year: academicYearStartYear,
                },
            });
        }

        return academicYearRecord;
    } catch (error: any) {
        logMsg(logType.ERROR, `Error getting or creating academic year: ${error.message}`);
        throw new Error("Could not determine or create the current academic year.");
    }
};
