import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
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
