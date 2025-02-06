import catchErrors from "../utils/catch-errors";
import { z } from "zod";
import { Request } from "express";
import { createAccount } from "../services/auth-service";
import { CREATED } from "../constants/http";
import { setAuthCookies } from "../utils/cookies";

// Controllers are responsible for 3 things:
// 1. Validate the request
// 2. Call the service
// 3. return the response

// This function is responsible for validating the request, we are using zod to validate
const registerSchema = z
    .object({
        email: z.string().email().min(3).max(255),
        password: z.string().min(8).max(255),
        confirmPassword: z.string().min(8).max(255),
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
