import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
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
    const isModerationPhase4 = await prisma.moderationStatus.findFirst({
        select: {
            moderationPhaseId: true,
        },
    });
    appAssert(isModerationPhase4, NOT_FOUND, "Could not retrieve assessments becuse it is not external review phase yet");
    if (!(isModerationPhase4.moderationPhaseId >= 4)) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: "Canot retrieve assessments because it is not external review phase yet",
        });
    }

    const reqBody: { id: number; message: string }[] = req.body;

    // Process notifications sequentially using a for...of loop
    for (const assessmentData of reqBody) {
        // Find the assessment and include related module and user data
        const assessment = await prisma.academicYearAssessment.findUnique({
            where: { id: assessmentData.id },
            select: {
                name: true,
                module: {
                    select: {
                        moduleLeadId: true,
                        moduleTutors: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
            },
        });

        // Handle case where assessment or module is not found
        if (!assessment || !assessment.module) {
            console.error(`Assessment or module not found for ID: ${assessmentData.id}. Skipping.`);
            // Continue to the next assessment in the request body
            continue;
        }

        const { moduleLeadId, moduleTutors } = assessment.module;
        const userIds = new Set<number>();

        // Add module lead ID if it exists
        if (moduleLeadId) {
            userIds.add(moduleLeadId);
        }

        // Add module tutor IDs
        moduleTutors.forEach((tutor) => userIds.add(tutor.userId));

        // Send notification sequentially to each unique user associated with the module
        for (const userId of userIds) {
            try {
                await sendNotification(
                    userId,
                    "info", // Consider making the type dynamic if needed
                    `Assessment Message for: ${assessment.name}`, // More specific title? e.g., "Message regarding Assessment [Assessment Name/ID]"
                    assessmentData.message
                );
            } catch (error) {
                // Log error and potentially decide whether to continue or stop
                console.error(`Failed to send notification to user ${userId} for assessment ${assessmentData.id}:`, error);
                // Depending on requirements, you might want to:
                // 1. Continue to the next user (current behavior)
                // 2. Stop processing this assessment and move to the next
                // 3. Stop the entire request and return an error
            }
        }
    }

    return res.status(OK).json({ message: "Notifications sent successfully" });
});
