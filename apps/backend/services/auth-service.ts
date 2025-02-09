import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { compareValue, hashValue } from "../utils/bcrypt";
import { ONE_DAY_IN_MS, thirtyDaysFromNow } from "../utils/date";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";

export type CreateAccountParams = {
    email: string;
    password: string;
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
        },
    });

    // Create a session
    // A session is a period of time where a user is is able to user the token and the refresh token to login
    const session = await prisma.session.create({
        data: {
            userId: user.id,
            userAgent: data.userAgent,
        },
    });

    // Sign access token and refresh token
    const refreshToken = signToken({ sessionId: session.id }, refreshTokenSignOptions);
    const accessToken = signToken({ userId: user.id, sessionId: session.id });

    // Remove password from user object before returning
    const { password, ...userWithoutPassword } = user;

    // return the user and tokens
    return { user: userWithoutPassword, accessToken, refreshToken };
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

    // Verify the password
    const passwordIsValid = await compareValue(password, user.password);
    appAssert(passwordIsValid, UNAUTHORIZED, "Invalid email or password");

    // Create a new session
    const session = await prisma.session.create({
        data: {
            userId: user.id,
            userAgent,
        },
    });
    const sessionInfo = {
        sessionId: session.id,
    };

    // Sign access and refresh tokens
    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
    const accessToken = signToken({ ...sessionInfo, userId: user.id });

    // Remove password from user object before returning
    const { password: userPassword, ...userWithoutPassword } = user;

    // Return the user and tokens
    return { user: userWithoutPassword, accessToken, refreshToken };
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
        const newSessionExpiresAt = thirtyDaysFromNow();
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
