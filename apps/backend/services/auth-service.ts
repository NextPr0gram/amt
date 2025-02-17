import AppErrorCode from "../constants/app-error-code";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { compareValue, hashValue } from "../utils/bcrypt";
import { ONE_DAY_IN_MS, oneYearFromNow } from "../utils/date";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";

export type CreateAccountParams = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userAgent?: string;
};

// All the business logic for creating an account
// 1. Verify user does not exist already
// 2. Create a new user
// 3. Create session
// 4. Sign access and refresh tokens
// 5. Return the user and tokens
export const createAccount = async (data: CreateAccountParams) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    appAssert(!existingUser, CONFLICT, "Email already in use");

    // Hash the password then create new user
    const hashedPassword = await hashValue(data.password);
    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
        },
    });

    // Create a session
    // A session is a period of time where a user is is able to user the token and the refresh token to login
    const session = await prisma.session.create({
        data: {
            userId: user.id,
            userAgent: data.userAgent,
            expiresAt: oneYearFromNow(),
        },
    });

    // Sign access token and refresh token
    const refreshToken = signToken({ sessionId: session.id }, refreshTokenSignOptions);
    const accessToken = signToken({ userId: user.id, sessionId: session.id });

    // return the user and tokens
    return { user, accessToken, refreshToken };
};

export type LoginUserParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export const loginUser = async ({ email, password, userAgent }: LoginUserParams) => {
    // Find the user by email
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    appAssert(user, UNAUTHORIZED, "Invalid email or password");

    // Get password from the user for verification, we need this because by default we are not
    const storedPasswordResult = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            password: true,
        },
    });
    appAssert(storedPasswordResult, UNAUTHORIZED, "Invalid email or password");
    const passwordIsValid = await compareValue(password, storedPasswordResult.password);
    appAssert(passwordIsValid, UNAUTHORIZED, "Invalid email or password");

    // Create a new session
    const session = await prisma.session.create({
        data: {
            userId: user.id,
            userAgent,
            expiresAt: oneYearFromNow(),
        },
    });
    const sessionInfo = {
        sessionId: session.id,
    };

    // Sign access and refresh tokens
    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
    const accessToken = signToken({ ...sessionInfo, userId: user.id });

    // Return the user and tokens
    return { user, accessToken, refreshToken };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
    const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
        secret: refreshTokenSignOptions.secret,
    });
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

    const session = await prisma.session.findUnique({
        where: {
            id: payload.sessionId,
        },
    });
    appAssert(session && session.expiresAt.getTime() > Date.now(), UNAUTHORIZED, "Session expired");

    // Refresh the session if it expires in the next 24 hours
    const sessionNeedsRefresh = session.expiresAt.getTime() - Date.now() <= ONE_DAY_IN_MS;

    if (sessionNeedsRefresh) {
        const newSessionExpiresAt = oneYearFromNow();
        await prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                expiresAt: newSessionExpiresAt,
            },
        });
    }

    const newRefreshToken = sessionNeedsRefresh ? signToken({ sessionId: session.id }, refreshTokenSignOptions) : undefined;
    const accessToken = signToken({ userId: session.userId, sessionId: session.id });

    return { accessToken, newRefreshToken };
};

export const validate = async (accessToken: string) => {
    const { payload } = verifyToken(accessToken);
    return !!payload; // Returns boolean, if payload is not null, return true
};
