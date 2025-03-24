import { Request, Response, NextFunction } from "express";
import { logMsg, logType } from "./logger";

type AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<any>;

// Catch errors in async controllers and pass them to the error handler middleware
export const catchErrors = (controller: AsyncController): AsyncController => {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

type AsyncFunction<T> = () => Promise<T>;

export const safeExecute = async <T>(
    fn: AsyncFunction<T>,
    errorMessage: string,
): Promise<T | null> => {
    try {
        return await fn();
    } catch (error: any) {
        logMsg(logType.ERROR, `${errorMessage}: ${error.message}`);
        return null;
    }
};
