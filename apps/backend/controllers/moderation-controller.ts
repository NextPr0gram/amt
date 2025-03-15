import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";

export const getModerationStatusHandler = catchErrors(async (req, res) => {
    const moderationStatus = await prisma.moderationPhase.findFirst({
        where: {
            id: 1,
        },
        select: {
            tP: {
                select: {
                    id: true,
                    name: true,
                },
            },
            stage: {
                select: {
                    id: true,
                    name: true,
                },
            },
            reviewType: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    appAssert(moderationStatus, NOT_FOUND, "Moderation phase not found");

    return res.status(OK).json(moderationStatus);
});
