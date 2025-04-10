import AppErrorCode from "../constants/app-error-code";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import {
    broadcastNotification,
    sendNotification,
} from "../services/notification-service";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";
import { getUserIdFromToken } from "../utils/jwt";

export const getReviewGroupsHandler = catchErrors(async (req, res) => {
    const reviewGroups = await prisma.reviewGroup.findMany({
        select: {
            id: true,
            year: true,
            group: true,
            modules: {
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

    const existingModules = await prisma.module.findMany({
        where: {
            id: { in: moduleIds },
            reviewGroupId: { not: null },
        },
    });
    appAssert(
        existingModules.length === 0,
        NOT_FOUND,
        "Modules already assigned in another review group",
        AppErrorCode.InvalidUsageOrAssignment,
    );

    // Get previous group character and increment it else start from A
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
    const nextChar = newestGroup
        ? String.fromCharCode(newestGroup.group.charCodeAt(0) + 1)
        : "A";

    const reviewGroup = await prisma.reviewGroup.create({
        data: {
            year: {
                connect: {
                    id: yearId,
                },
            },
            group: nextChar,
            convener: {
                connect: {
                    id: convener,
                },
            },
        },
    });

    // Update the modules to reference the new review group
    await prisma.module.updateMany({
        where: {
            id: { in: moduleIds },
        },
        data: {
            reviewGroupId: reviewGroup.id,
        },
    });

    await broadcastNotification(
        "info",
        "Review group",
        `New review group created for yearId: ${yearId}, moduleIds: ${moduleIds.join(", ")}, convener: ${convener}`,
    );

    return res.status(OK).json(reviewGroup);
});

export const deleteReviewGroupHandler = catchErrors(async (req, res) => {
    const { moduleId } = req.body;
    const userId = (await getUserIdFromToken(
        req.cookies.accessToken,
    )) as number;

    // Find which review group contains this module
    const reviewGroupModule = await prisma.module.findUnique({
        where: {
            id: moduleId,
        },
        include: {
            reviewGroup: true,
        },
    });
    console.log("reviewGroupModule: ", reviewGroupModule);

    appAssert(
        reviewGroupModule,
        NOT_FOUND,
        "Module not found in any review group",
    );

    const groupName = reviewGroupModule.reviewGroup.group;
    console.log("groupName: ", groupName);

    // Delete the module from the review group
    const removeReviewGroupFromModule = await prisma.module.update({
        where: {
            id: moduleId,
        },
        data: {
            reviewGroupId: null,
        },
    });
    console.log("removeReviewGroupFromModule: ", removeReviewGroupFromModule);

    appAssert(
        removeReviewGroupFromModule,
        INTERNAL_SERVER_ERROR,
        "Something went wrong while trying to remove review group from module",
    );

    // Count remaining modules in this review group
    const remainingModules = await prisma.module.count({
        where: {
            reviewGroupId: reviewGroupModule.reviewGroup.id,
        },
    });
    console.log("remainingModules: ", remainingModules);

    // If no modules left, delete the review group and shift other groups
    if (remainingModules === 0) {
        // Get the review group's year to find other groups in the same year
        const year = await prisma.year.findUnique({
            where: {
                id: reviewGroupModule.reviewGroup.yearId,
            },
        });
        console.log("year: ", year);

        // Delete the empty review group
        const deleteReviewGroup = await prisma.reviewGroup.delete({
            where: {
                id: reviewGroupModule.reviewGroup.id,
            },
        });
        console.log("deleteReviewGroup: ", deleteReviewGroup);
        appAssert(deleteReviewGroup, INTERNAL_SERVER_ERROR);

        // Get all remaining review groups in the same year that have a higher letter
        const groupsToUpdate = await prisma.reviewGroup.findMany({
            where: {
                yearId: reviewGroupModule.reviewGroup.yearId,
                group: {
                    gt: groupName,
                },
            },
            orderBy: {
                group: "asc",
            },
        });
        console.log("groupsToUpdate: ", groupsToUpdate);
        appAssert(
            groupsToUpdate,
            INTERNAL_SERVER_ERROR,
            "Something went wrong while trying to update review groups",
        );

        // Update each group's letter, shifting down one letter
        for (const group of groupsToUpdate) {
            const newLetter = String.fromCharCode(
                group.group.charCodeAt(0) - 1,
            );
            const updateReviewGroupLetter = await prisma.reviewGroup.update({
                where: {
                    id: group.id,
                },
                data: {
                    group: newLetter,
                },
            });
            console.log("updateReviewGroupLetter: ", updateReviewGroupLetter);
            appAssert(
                updateReviewGroupLetter,
                INTERNAL_SERVER_ERROR,
                "something went wrong while updating review group letter",
            );
        }
    }

    await sendNotification(
        userId,
        "info",
        "Review Group",
        `Module ${reviewGroupModule.code} - ${reviewGroupModule.name} has been removed from review group ${groupName}.${remainingModules === 0 ? " Empty review group was deleted." : ""}`,
    );

    return res.status(OK).json({
        message: `Module removed from review group ${groupName}.${remainingModules === 0 ? " Empty review group was deleted." : ""}`,
    });
});
