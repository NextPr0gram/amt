import AppErrorCode from "../constants/app-error-code";
import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import { io } from "../server";
import { broadcastNotification } from "../services/notification-service";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";

export const getReviewGroupsHandler = catchErrors(async (req, res) => {
    const reviewGroups = await prisma.reviewGroup.findMany({
        select: {
            id: true,
            year: true,
            group: true,
            modules: {
                select: {
                    module: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            moduleLead: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                            moduleTutors: {
                                select: {
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            convener: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });

    appAssert(reviewGroups.length, NOT_FOUND, "Review groups not found");
    return res.status(OK).json(reviewGroups);
});

export const createReviewGroupHandler = catchErrors(async (req, res) => {
    const { yearId, moduleIds, convener } = req.body;

    // Check if existing review groups contain the same modules

    const modulesInExsistingReviewGroups = await prisma.reviewGroup.findMany({
        where: {
            modules: {
                some: {
                    moduleId: {
                        in: moduleIds,
                    },
                },
            },
        },
    });
    appAssert(!modulesInExsistingReviewGroups.length, NOT_FOUND, "Modules already assigned in another review group", AppErrorCode.InvalidUsageOrAssignment);

    // Get previour group character and increment it else start from A
    const newestGroup = await prisma.reviewGroup.findFirst({
        where: {
            year: {
                id: yearId,
            },
        },
        orderBy: {
            group: "desc",
        },
    });
    const nextChar = newestGroup ? String.fromCharCode(newestGroup.group.charCodeAt(0) + 1) : "A";

    const reviewGroup = await prisma.reviewGroup.create({
        data: {
            year: {
                connect: {
                    id: yearId,
                },
            },
            group: nextChar,
            modules: {
                create: moduleIds.map((id: number) => ({
                    module: { connect: { id } },
                })),
            },
            convener: {
                connect: {
                    id: convener,
                },
            },
        },
    });
    broadcastNotification(io, "info", "review-group", `New review group created for yearId: ${yearId}, moduleIds: ${moduleIds.join(", ")}, convener: ${convener}`);

    return res.status(OK).json(reviewGroup);
});
