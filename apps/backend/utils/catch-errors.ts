import { Request, Response, NextFunction } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// Catch errors in async controllers and pass them to the error handler middleware
const catchErrors = (controller: AsyncController): AsyncController => {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

export default catchErrors;
