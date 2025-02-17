import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, oneYearFromNow } from "./date";

const secure = process.env.NODE_ENV !== "development";
export const refreshPath = "/auth/refresh";

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: oneYearFromNow(),
    path: refreshPath,
});

type Params = {
    res: Response;
    accessToken: string;
    refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
    return res.cookie("accessToken", accessToken, getAccessTokenCookieOptions()).cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res: Response) => {
    return res.clearCookie("accessToken").clearCookie("refreshToken", { path: refreshPath });
};
