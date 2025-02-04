import { ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/http";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send("Something went wrong");
};

export default errorHandler;
