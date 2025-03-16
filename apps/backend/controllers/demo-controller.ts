import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import catchErrors from "../utils/catch-errors";
import { updateClients } from "../services/moderation-status-service";
import { createBoxFolders } from "../services/box-service";
import { BOX_DEV_TOKEN } from "../constants/env";
import appAssert from "../utils/app-assert";
import { broadcastNotification } from "../services/notification-service";
import AppErrorCode from "../constants/app-error-code";

export const prevPhaseHandler = catchErrors(async (req, res) => {
    const currentStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
    });

    if (!currentStatus) {
        return res.status(NOT_FOUND).json({ error: "Moderation status not found" });
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

    return res.status(OK).json(changeToPrevPhase);
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
    updateClients();

    return res.status(OK).json(changeToNextPhase);
});

export const createBoxFoldersHandler = catchErrors(async (req, res) => {
    const isBoxfolderCreated = await createBoxFolders(BOX_DEV_TOKEN)

    appAssert(isBoxfolderCreated, INTERNAL_SERVER_ERROR, "Could not create box folders", AppErrorCode.FaiedToCreateBoxFolders)

    isBoxfolderCreated && broadcastNotification("info", "Box folders created successfully")

    return res.status(OK).json({ message: "box folders created" })
})
