import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import { catchErrors } from "../utils/catch-errors";
import { advanceModerationStatus, moveToPreviousModerationStatus, updateClients } from "../services/moderation-status-service";
import { createBoxFolders } from "../services/box-service";
import { BOX_DEV_TOKEN } from "../constants/env";
import appAssert from "../utils/app-assert";
import { broadcastNotification } from "../services/notification-service";
import AppErrorCode from "../constants/app-error-code";
import { getUserIdFromRequest } from "../services/user-service";

export const prevPhaseHandler = catchErrors(async (req, res) => {
    const changeToPrevPhase = await moveToPreviousModerationStatus();
    return res.status(OK).json(changeToPrevPhase);
});

export const nextPhaseHandler = catchErrors(async (req, res) => {
    const changeToNextPhase = await advanceModerationStatus();
    return res.status(OK).json(changeToNextPhase);
});

export const createBoxFoldersHandler = catchErrors(async (req, res) => {
    const userId = await getUserIdFromRequest(req);
    const isBoxfolderCreated = await createBoxFolders(userId);

    appAssert(isBoxfolderCreated, INTERNAL_SERVER_ERROR, "Could not create box folders", AppErrorCode.FaiedToCreateBoxFolders);

    isBoxfolderCreated && broadcastNotification("info", "Box folders created successfully");

    return res.status(OK).json({ message: "box folders created" });
});
