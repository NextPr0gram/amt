import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import { getUserIdFromRequest } from "../services/user-service";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";
import { getUserIdFromToken } from "../utils/jwt";

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
    const notifications = await prisma.userNotification.findMany({
        where: {
            userId: req.userId,
        },
        select: {
            notification: {
                select: {
                    id: true,
                    title: true,
                    message: true,
                    notificationType: {
                        select: {
                            name: true,
                        },
                    },
                    createdAt: true,
                },
            },
        },
        orderBy: {
            notification: {
                createdAt: "desc",
            },
        },
    });

    return res.status(OK).json(notifications);
});

export const getUserRoles = catchErrors(async (req, res) => {
    const userId = getUserIdFromToken(req.cookies.accessToken);
    const userRoles = await prisma.userRole.findMany({
        where: {
            userId,
        },
        select: {
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    appAssert(userRoles, NOT_FOUND, "Could not retrieve user roles");

    return res.status(OK).json(userRoles);
});

export const getReviewGroupHandler = catchErrors(async (req, res) => {
    const isModerationPhase3 = await prisma.moderationStatus.findFirst({
        select: {
            moderationPhaseId: true,
        },
    });
    appAssert(
        isModerationPhase3,
        NOT_FOUND,
        "Could not retrieve review group becuse it is not internal review phase yet",
    );
    if (!(isModerationPhase3.moderationPhaseId >= 3)) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "Canot retrieve review groups when not finalized",
        });
    }

    const userId = getUserIdFromToken(req.cookies.accessToken);
    appAssert(userId, NOT_FOUND, "Could not get userId from accessToken");

    const reviewGroup = await prisma.reviewGroup.findFirst({
        where: {
            modules: {
                some: {
                    OR: [
                        { moduleLeadId: userId },
                        { moduleTutors: { some: { userId } } },
                    ],
                },
            },
        },
        select: {
            id: true,
            group: true,
            year: {
                select: {
                    name: true,
                },
            },
            convener: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            modules: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    moduleLead: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    moduleTutors: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    appAssert(reviewGroup, NOT_FOUND, "Could not retrieve review group");

    return res.status(OK).json(reviewGroup);
});

export const getUserAssessmentsForCurrentAcademicYearHandler = catchErrors(
    async (req, res) => {
        const isModerationPhase3 = await prisma.moderationStatus.findFirst({
            select: {
                moderationPhaseId: true,
            },
        });
        appAssert(
            isModerationPhase3,
            NOT_FOUND,
            "Could not retrieve assessments becuse it is not internal review phase yet",
        );
        if (!(isModerationPhase3.moderationPhaseId >= 3)) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                message: "Canot retrieve review groups when not finalized",
            });
        }
        const userId = getUserIdFromToken(req.cookies.accessToken);

        const assessments = await prisma.academicYearAssessment.findMany({
            where: {
                OR: [
                    {
                        module: {
                            moduleLeadId: userId,
                        },
                    },
                    {
                        module: {
                            moduleTutors: {
                                some: {
                                    userId,
                                },
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                module: {
                    select: {
                        code: true,
                    },
                },
                assessmentType: true,
                assessmentCategory: true,
                weight: true,
                folderId: true,
            },
        });
        appAssert(assessments, NOT_FOUND, "Could not retrieve assessments");
        return res.status(OK).json(assessments);
    },
);

export const getIsBoxConnected = catchErrors(async (req, res) => {});
