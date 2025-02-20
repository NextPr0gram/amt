import { RequestHandler } from "express";

const logRequests: RequestHandler = (req, res, next) => {
    console.log(req.method, req.path);
    next();
};

export default logRequests;
