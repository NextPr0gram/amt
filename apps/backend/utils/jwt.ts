import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import type { User, Session } from "@prisma/client";

export type RefreshTokenPayload = {
    sessionId: Session["id"];
};

export type AccessTokenPayload = {
    userId: User["id"];
    sessionId: Session["id"];
};

type SignOptionsAndSecret = SignOptions & { secret: string };

const defaults: SignOptions = {
    audience: ["user"],
};

export const accessTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: "15m",
    secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: 365 * 24 * 60 * 60,
    secret: JWT_REFRESH_SECRET,
};

export const signToken = (payload: AccessTokenPayload | RefreshTokenPayload, options?: SignOptionsAndSecret) => {
    const { secret, ...signOpts } = options || accessTokenSignOptions;
    return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};

export const verifyToken = <TPayLoad extends object = AccessTokenPayload>(token: string, options?: VerifyOptions & { secret: string }) => {
    const { secret = JWT_SECRET, ...verifyOpts } = options || {};

    try {
        const payload = jwt.verify(token, secret, { ...defaults, ...verifyOpts }) as TPayLoad;
        return { payload };
    } catch (error: any) {
        return {
            error: error.message,
        };
    }
};
