import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";
import AppError from "../utils/app-error";
import { clearAuthCookies, refreshPath } from "../utils/cookies";
import { Prisma } from "@prisma/client";
import PrismaErrorCode from "../constants/prisma-error-code";
import AppErrorCode from "../constants/app-error-code";
import { broadcastNotification } from "../services/notification-service";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";

const handleZodError = (res: Response, error: z.ZodError) => {
    const errors = error.issues.map((err) => ({
        message: err.path.join(".") + ": " + err.message,
    }));
    const formattedMessage = errors.map((err) => err.message).join(", ");
    res.status(BAD_REQUEST).json({ message: formattedMessage });
};

const handleAppError = async (res: Response, error: AppError) => {
    if (error.errorCode === AppErrorCode.FaiedToCreateBoxFolders) {
        await broadcastNotification("error", "Box Error", "Something went wrong while creating folders in Box");
    } else if (error.errorCode === AppErrorCode.FailedToRefreshBoxToken) {
        const userId = error.opts?.userId;
        const deleteBoxRefreshTokenFromUser = async () => {
            await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    boxRefreshToken: null,
                },
            });
        };
        appAssert(deleteBoxRefreshTokenFromUser, INTERNAL_SERVER_ERROR, "Failed to remove box refresh token from user");
    }
    return res.status(error.statusCode).json({ message: error.message, errorCode: error.errorCode });
};

const handlePrismaError = (res: Response, error: Error) => {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === PrismaErrorCode.UniqueConstraintViolation) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "Module with given module code already exists",
            errorCode: PrismaErrorCode.UniqueConstraintViolation,
        });
    }
};

const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
    console.error(`PATH ${req.path}`, error);

    if (req.path === refreshPath) {
        clearAuthCookies(res);
    }

    if (error instanceof z.ZodError) {
        handleZodError(res, error);
        return;
    }

    if (error instanceof AppError) {
        handleAppError(res, error);
        return;
    }

    // if its a prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(res, error);
    }

    res.status(INTERNAL_SERVER_ERROR).send("Something went wrong");
};

export default errorHandler;
