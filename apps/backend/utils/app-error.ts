import AppErrorCode from "../constants/app-error-code";

class AppError extends Error {
    constructor(public statusCode: number, public message: string, public errorCode?: AppErrorCode) {
        super(message);
    }
}

export default AppError;
