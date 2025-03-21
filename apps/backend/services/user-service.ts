import { Request } from "express";
import { getUserIdFromToken } from "../utils/jwt";

export const getUserIdFromRequest = async (req: Request) => {
    const accessToken = req.cookies.accessToken as string;
    const userId = getUserIdFromToken(accessToken);
    return userId;
};
