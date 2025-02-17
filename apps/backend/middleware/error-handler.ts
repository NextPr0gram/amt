import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";
import AppError from "../utils/app-error";
import { clearAuthCookies, refreshPath } from "../utils/cookies";

const handleZodError = (res: Response, error: z.ZodError) => {
    const errors = error.issues.map((err) => ({
        message: err.path.join(".") + ": " + err.message,
    }));
    const formattedMessage = errors.map((err) => err.message).join(", ");
    res.status(BAD_REQUEST).json({ message: formattedMessage });
};

const handleAppError = (res: Response, error: AppError) => {
    return res.status(error.statusCode).json({ message: error.message, errorCode: error.errorCode });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
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

    res.status(INTERNAL_SERVER_ERROR).send("Something went wrong");
};

export default errorHandler;
