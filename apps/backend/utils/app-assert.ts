import assert from "node:assert";
import { HttpStatusCode } from "../constants/http";
import AppErrorCode from "../constants/app-error-code";
import AppError from "./app-error";

type AppAssert = (
    condition: any,
    HttpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode,
    opts?: object,
) => asserts condition;

//Asserts a condition and throws an AppError if the condition is false.
const appAssert: AppAssert = (
    condition,
    httpStatusCode,
    message,
    appErrorCode,
    opts,
) =>
    assert(
        condition,
        new AppError(httpStatusCode, message, appErrorCode, opts),
    );

export default appAssert;
