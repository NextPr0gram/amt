import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import { sendNotification } from "../services/notification-service";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";

export const getModuleTutorsHandler = catchErrors(async (req, res) => {
    const moduleTutors = await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            role: {
                select: {
                    role: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    appAssert(moduleTutors, NOT_FOUND, "Module tutors not found");
    return res.status(OK).json(moduleTutors);
});

export const sendNotificationsToUsersHandler = catchErrors(async (req, res) => {
    const reqBody: { id: number; message: string }[] = req.body;
    reqBody.forEach(async (user) => {
        sendNotification(user.id, "info", "The Assesment Lead has sent you a message", user.message);
    });
    return res.status(OK).json({ message: "Notifications sent successfully" });
});
