import { RequestHandler } from "express";
import { logMsg, logType } from "../utils/logger";

const logRequests: RequestHandler = (req, res, next) => {
    logMsg(logType.HTTP, `${req.method} ${req.path}`);
    next();
};

export default logRequests;
