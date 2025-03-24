import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";

export const getUserHandler = catchErrors(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.userId,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
        },
    });

    appAssert(user, NOT_FOUND, "User not found");
    return res.status(OK).json(user);
});

export const getUserNotifications = catchErrors(async (req, res) => {
    const notifications = await prisma.notification.findMany({
        where: {
            userId: req.userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return res.status(OK).json(notifications);
});
