import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/primsa-client";
import {
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
} from "../constants/http";
import appAssert from "../utils/app-assert";
import { getUserIdFromRequest } from "../services/user-service";
import { catchErrors } from "../utils/catch-errors";

export const userRoles = {
    assessmentLead: 1,
    moduleLead: 2,
    moduleTutor: 3,
    officeStaff: 4,
    externalReviewer: 5,
    dev: 6,
};

const userRoleCache: Map<number, { roleIds: number[]; timestamp: number }> =
    new Map();

const CACHE_DURATION = 5 * 60 * 1000;

async function getRolesFromCache(userId: number) {
    const cachedData = userRoleCache.get(userId);

    if (cachedData) {
        if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
            return cachedData.roleIds;
        } else {
            userRoleCache.delete(userId);
        }
    }

    const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: {
            role: {
                select: {
                    id: true,
                },
            },
        },
    });

    const roleIds = userRoles.map((ur) => ur.role.id);

    appAssert(
        roleIds.length > 0,
        INTERNAL_SERVER_ERROR,
        "Roles not found for user",
    );

    userRoleCache.set(userId, {
        roleIds,
        timestamp: Date.now(),
    });

    return roleIds;
}

export const authorizeRoles = (...allowedRoles: number[]) => {
    return catchErrors(
        async (req: Request, res: Response, next: NextFunction) => {
            const userId = await getUserIdFromRequest(req);
            appAssert(userId, UNAUTHORIZED, "Unauthorized: No user ID");

            const userRoles = await getRolesFromCache(userId);

            const hasAccess = userRoles.some((roleId) =>
                allowedRoles.includes(roleId),
            );
            appAssert(
                hasAccess,
                FORBIDDEN,
                "Forbidden: Insufficient permissions",
            );

            next();
        },
    );
};
