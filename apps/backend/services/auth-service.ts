import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import prisma from "../prisma/primsa-client";
import { hashValue } from "../utils/bcrypt";
import jwt from "jsonwebtoken";

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
    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash the password then create new user
    const hashedPassword = await hashValue(data.password);
    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: data.password,
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
    const refreshToken = jwt.sign({ sessionID: session.id }, JWT_REFRESH_SECRET, { audience: ["user"], expiresIn: "30d" });
    const accessToken = jwt.sign({ userID: user.id, sessionID: session.id }, JWT_SECRET, { audience: ["user"], expiresIn: "15m" });

    // return the user and tokens
    return { user, accessToken, refreshToken };
};
