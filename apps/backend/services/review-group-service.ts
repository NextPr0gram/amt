import prisma from "../prisma/primsa-client";
import { safeExecute } from "../utils/catch-errors";

export const removeModeratorRoleFromUsers = () =>
    safeExecute(async () => {
        // get all users with moderator role
        // remove the moderator role from them
        const users = await prisma.user.findMany({
            where: {
                role: {
                    some: {
                        role: {
                            name: "Moderator",
                        },
                    },
                },
            },
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
        if (users.length === 0) {
            return {
                status: 404,
                message: "No users found with moderator role",
            };
        }
        const userIds = users.map((user) => user.id);
        await prisma.userRole.deleteMany({
            where: {
                userId: {
                    in: userIds,
                },
                roleId: (
                    await prisma.role.findFirst({
                        where: { name: "Moderator" },
                        select: { id: true },
                    })
                )?.id,
            },
        });
    }, "Could not remove moderator role from users");
