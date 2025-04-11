import prisma from "apps/backend/prisma/primsa-client";
import { catchErrors } from "apps/backend/utils/catch-errors";
import { getUserIdFromToken } from "apps/backend/utils/jwt";
import { Router, Request, Response } from "express";

const authorizeRouter = Router();

authorizeRouter.post(
    "/",
    catchErrors(async (req: Request, res: Response) => {
        const userId = await getUserIdFromToken(req.cookies.accessToken);
        const { path } = req.body;

        if (!userId || !path) {
            return res.status(400).json({ message: "Invalid request" });
        }

        // Map paths to required roles
        const pathRoleMap: { [key: string]: number[] } = {
            "/dashboard": [1, 2, 3],
            "/review-groups": [1], // Assessment Lead, Module Tutor
            "/users": [1], // Assessment Lead
            "/modules": [1], // Assessment Lead
            "/assessments": [1], // Assessment Lead
            "/deadlines": [1], // Assessment Lead
        };

        const requiredRoles = pathRoleMap[path];
        if (!requiredRoles) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Fetch user roles
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

        const userRoleIds = userRoles.map((ur) => ur.role.id);

        // Check if the user has any of the required roles
        const hasAccess = requiredRoles.some((role) =>
            userRoleIds.includes(role),
        );
        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({ message: "Access granted" });
    }),
);

export default authorizeRouter;
