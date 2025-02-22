import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";

export const getModuleTutorsHandler = catchErrors(async (req, res) => {
    const moduleTutors = await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            Role: {
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
