import catchErrors from "../utils/catch-errors";
import { z } from "zod";
import { createAccount, loginUser } from "../services/auth-service";
import { CREATED, OK } from "../constants/http";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { verifyToken } from "../utils/jwt";
import prisma from "../prisma/primsa-client";

const emailSchema = z.string().email().min(3).max(255);
const passwordSchema = z.string().min(6).max(255);

// Controllers are responsible for 3 things:
// 1. Validate the request
// 2. Call the service
// 3. return the response

// This function is responsible for validating the request, we are using zod to validate
const registerSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string().min(6).max(255),
        userAgent: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const registerHandler = catchErrors(async (req, res) => {
    // Validate the request
    const Request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
    });

    // Call the service
    const { user, accessToken, refreshToken } = await createAccount(Request);

    // Return the response
    return setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json(user);
});

const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional(),
});

export const loginHandler = catchErrors(async (req, res) => {
    const Request = loginSchema.parse({ ...req.body, userAgent: req.headers["user-agent"] });
    const { accessToken, refreshToken } = await loginUser(Request);
    return setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json({ message: "Login successul" });
});

export const logoutHandler = catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const { payload } = verifyToken(accessToken);

    if (payload) {
        await prisma.session.delete({
            where: {
                id: payload.sessionId,
            },
        });
    }

    return clearAuthCookies(res).status(OK).json({ message: "Logout successful" });
});
