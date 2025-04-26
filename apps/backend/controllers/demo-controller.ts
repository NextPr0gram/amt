import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import { catchErrors } from "../utils/catch-errors";
import { advanceModerationStatus, moveToPreviousModerationStatus, updateClients } from "../services/moderation-status-service";
import { createBoxFolders } from "../services/box-service";
import { BOX_DEV_TOKEN } from "../constants/env";
import appAssert from "../utils/app-assert";
import { broadcastNotification, sendNotification } from "../services/notification-service";
import AppErrorCode from "../constants/app-error-code";
import { getUserIdFromRequest } from "../services/user-service";
import { getUserIdFromToken } from "../utils/jwt";

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

    isBoxfolderCreated && (await broadcastNotification("info", "Box folders created successfully"));

    return res.status(OK).json({ message: "box folders created" });
});

export const unfinalizeReviewGroupsHandler = catchErrors(async (req, res) => {
    const userId = getUserIdFromToken(req.cookies.accessToken) as number;

    const updateModerationStatus = await prisma.moderationStatus.update({
        where: {
            id: 1,
        },
        data: {
            finalizeReviewGroups: false,
        },
    });
    appAssert(updateModerationStatus, INTERNAL_SERVER_ERROR, "Something went wront while updating moderationStatus");
    sendNotification(userId, "info", "Review groups unfinalized");
});

/*
demoRouter.get("/get-date", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), getCurrentDateHandler);
demoRouter.post("/add-1-day", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), add1DayHandler);
demoRouter.post("/add-5-days", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), add5DaysHandler);
demoRouter.post("/add-10-days", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), add10DaysHandler);
demoRouter.post("/subtract-1-day", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), subtract1DayHandler);
demoRouter.post("/subtract-5-days", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), subtract5DaysHandler);
demoRouter.post("/subtract-10-days", authorizeRoles(userRoles.assessmentLead, userRoles.dev, userRoles.moduleTutor, userRoles.moduleTutor), subtract10DaysHandler);
*/

export const getCurrentDateHandler = catchErrors(async (req, res) => {
    const currentDate = await prisma.dateDemo.findFirst({
        select: {
            date: true,
        },
    });
    appAssert(currentDate, NOT_FOUND, "Date not found");
    return res.status(OK).json(currentDate.date);
});

export const add1DayHandler = catchErrors(async (req, res) => {
    const currentDate = await prisma.dateDemo.findFirst({
        select: {
            date: true,
        },
    });
    appAssert(currentDate, NOT_FOUND, "Date not found");
    const newDate = new Date(currentDate.date);
    newDate.setDate(currentDate.date.getDate() + 1);
    await prisma.dateDemo.update({
        where: {
            id: 1,
        },
        data: {
            date: newDate,
        },
    });
    return res.status(OK).json(newDate);
});

export const add5DaysHandler = catchErrors(async (req, res) => {
    const currentDate = await prisma.dateDemo.findFirst({
        select: {
            date: true,
        },
    });
    appAssert(currentDate, NOT_FOUND, "Date not found");
    const newDate = new Date(currentDate.date);
    newDate.setDate(currentDate.date.getDate() + 5);
    await prisma.dateDemo.update({
        where: {
            id: 1,
        },
        data: {
            date: newDate,
        },
    });
    return res.status(OK).json(newDate);
});

export const add10DaysHandler = catchErrors(async (req, res) => {
    const currentDate = await prisma.dateDemo.findFirst({
        select: {
            date: true,
        },
    });
    appAssert(currentDate, NOT_FOUND, "Date not found");
    const newDate = new Date(currentDate.date);
    newDate.setDate(currentDate.date.getDate() + 10);
    await prisma.dateDemo.update({
        where: {
            id: 1,
        },
        data: {
            date: newDate,
        },
    });
    return res.status(OK).json(newDate);
});

export const subtract1DayHandler = catchErrors(async (req, res) => {
    const currentDate = await prisma.dateDemo.findFirst({
        select: {
            date: true,
        },
    });
    appAssert(currentDate, NOT_FOUND, "Date not found");
    const newDate = new Date(currentDate.date);
    newDate.setDate(currentDate.date.getDate() - 1);
    await prisma.dateDemo.update({
        where: {
            id: 1,
        },
        data: {
            date: newDate,
        },
    });
    return res.status(OK).json(newDate);
});

export const subtract5DaysHandler = catchErrors(async (req, res) => {
    const currentDate = await prisma.dateDemo.findFirst({
        select: {
            date: true,
        },
    });
    appAssert(currentDate, NOT_FOUND, "Date not found");
    const newDate = new Date(currentDate.date);
    newDate.setDate(currentDate.date.getDate() - 5);
    await prisma.dateDemo.update({
        where: {
            id: 1,
        },
        data: {
            date: newDate,
        },
    });
    return res.status(OK).json(newDate);
});

export const subtract10DaysHandler = catchErrors(async (req, res) => {
    const currentDate = await prisma.dateDemo.findFirst({
        select: {
            date: true,
        },
    });
    appAssert(currentDate, NOT_FOUND, "Date not found");
    const newDate = new Date(currentDate.date);
    newDate.setDate(currentDate.date.getDate() - 10);
    await prisma.dateDemo.update({
        where: {
            id: 1,
        },
        data: {
            date: newDate,
        },
    });
    return res.status(OK).json(newDate);
});
