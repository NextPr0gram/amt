import { BOX_CLIENT_ID, BOX_CLIENT_SECRET } from "../constants/env";
import { generateStateToken } from "../utils/jwt";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    OK,
} from "../constants/http";
const { BoxClient } = require("box-typescript-sdk-gen/lib/client.generated.js");
import { BoxOAuth, OAuthConfig } from "box-typescript-sdk-gen";
import { log, warn } from "node:console";
import AppErrorCode from "../constants/app-error-code";
import { logMsg, logType } from "../utils/logger";
import { sendNotification } from "./notification-service";

// In-memory cache for access tokens
const boxAccessTokens = new Map();

// OAuth configuration
const oauthConfig = new OAuthConfig({
    clientId: BOX_CLIENT_ID,
    clientSecret: BOX_CLIENT_SECRET,
});

// Get the Box Authorization URL
export const getAuthorizeUrl = async (userId: number) => {
    const state = generateStateToken(userId);

    const params = {
        client_id: BOX_CLIENT_ID,
        redirect_uri: "http://localhost:5000/api/v1/box/callback",
        response_type: "code",
        state,
    };

    const queryString = new URLSearchParams(params).toString();

    const url = `https://account.box.com/api/oauth2/authorize?${queryString}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    appAssert(res, INTERNAL_SERVER_ERROR, "Could not get Box auth url");

    const resUrl = res.url;
    return resUrl;
};

// Exchange auth code for tokens and save them
export const connectBox = async (userId: number, authCode: string) => {
    const url = "https://api.box.com/oauth2/token";

    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        client_id: BOX_CLIENT_ID,
        client_secret: BOX_CLIENT_SECRET,
    });

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    appAssert(
        res.ok,
        INTERNAL_SERVER_ERROR,
        "Could not exchange authorization code for tokens",
    );

    const data = await res.json();

    appAssert(
        data.access_token,
        INTERNAL_SERVER_ERROR,
        "No access token returned",
    );

    // Expiry date -10 minutes
    const expiresInDate = Date.now() + (data.expires_in - 600) * 1000;

    boxAccessTokens.set(userId, {
        accessToken: data.access_token,
        expiresIn: expiresInDate,
    });
    const storeBoxRefreshToken = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            boxRefreshToken: data.refresh_token,
        },
    });
    appAssert(
        storeBoxRefreshToken,
        INTERNAL_SERVER_ERROR,
        "Something went wrong while trying to store the Box refresh token",
    );

    return data.access_token;
};

const refreshBoxAccessToken = async (userId: number, refreshToken: string) => {
    const url = "https://api.box.com/oauth2/token";

    const body = new URLSearchParams({
        client_id: BOX_CLIENT_ID,
        client_secret: BOX_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    appAssert(
        res.status,
        INTERNAL_SERVER_ERROR,
        "Could not refresh token",
        AppErrorCode.FailedToRefreshBoxToken,
        { userId },
    );

    const data = await res.json();

    // Expiry date 60 minutes -10 minutes
    const expiresInDate = Date.now() + (data.expires_in - 600) * 1000;

    boxAccessTokens.set(userId, {
        accessToken: data.access_token,
        expiresIn: expiresInDate,
    });
    const storeBoxRefreshToken = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            boxRefreshToken: data.refresh_token,
        },
    });
    appAssert(
        storeBoxRefreshToken,
        INTERNAL_SERVER_ERROR,
        "Something went wrong while trying to store the Box refresh token",
    );
};

const getBoxAccessToken = async (userId: number) => {
    let token = boxAccessTokens.get(userId);

    if (!token || Date.now() > token.expiresIn) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { boxRefreshToken: true },
        });

        appAssert(
            user?.boxRefreshToken,
            INTERNAL_SERVER_ERROR,
            "Refresh token not found",
        );

        await refreshBoxAccessToken(userId, user.boxRefreshToken);
        token = boxAccessTokens.get(userId);
    }

    return token?.accessToken;
};

export const createBoxFolders = async (userId: number) => {
    const boxAccessToken = await getBoxAccessToken(userId);

    // Year 1 modules
    const year1tp1modules = await prisma.module.findMany({
        where: {
            yearId: 1,
            tps: {
                some: { tp: { id: 1 } }, // Using id: 1 for tp1
            },
            NOT: {
                tps: {
                    some: { tp: { id: 2 } }, // Using id: 2 for tp2
                },
            },
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("year1tp1modules: ", year1tp1modules);

    const year1tp2modules = await prisma.module.findMany({
        where: {
            yearId: 1,
            tps: {
                some: { tp: { id: 2 } }, // Using id: 2 for tp2
            },
            NOT: {
                tps: {
                    some: { tp: { id: 1 } }, // Using id: 1 for tp1
                },
            },
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("year1tp2modules: ", year1tp2modules);

    const year1bothTpModules = await prisma.module.findMany({
        where: {
            yearId: 1,
            tps: {
                some: { tp: { id: 1 } }, // Using id: 1 for tp1
            },
            AND: [
                {
                    tps: {
                        some: { tp: { id: 2 } }, // Using id: 2 for tp2
                    },
                },
            ],
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("year1bothTpModules: ", year1bothTpModules);

    // Year 2 modules
    const year2tp1modules = await prisma.module.findMany({
        where: {
            yearId: 2,
            tps: {
                some: { tp: { id: 1 } }, // Using id: 1 for tp1
            },
            NOT: {
                tps: {
                    some: { tp: { id: 2 } }, // Using id: 2 for tp2
                },
            },
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("year2tp1modules: ", year2tp1modules);

    const year2tp2modules = await prisma.module.findMany({
        where: {
            yearId: 2,
            tps: {
                some: { tp: { id: 2 } }, // Using id: 2 for tp2
            },
            NOT: {
                tps: {
                    some: { tp: { id: 1 } }, // Using id: 1 for tp1
                },
            },
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("year2tp2modules: ", year2tp2modules);

    const year2bothTpModules = await prisma.module.findMany({
        where: {
            yearId: 2,
            tps: {
                some: { tp: { id: 1 } }, // Using id: 1 for tp1
            },
            AND: [
                {
                    tps: {
                        some: { tp: { id: 2 } }, // Using id: 2 for tp2
                    },
                },
            ],
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("year2bothTpModules: ", year2bothTpModules);

    // Year 3 modules
    const year3tp1modules = await prisma.module.findMany({
        where: {
            yearId: 3,
            tps: {
                some: { tp: { id: 1 } }, // Using id: 1 for tp1
            },
            NOT: {
                tps: {
                    some: { tp: { id: 2 } }, // Using id: 2 for tp2
                },
            },
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("year3tp1modules: ", year3tp1modules);

    const year3tp2modules = await prisma.module.findMany({
        where: {
            yearId: 3,
            tps: {
                some: { tp: { id: 2 } }, // Using id: 2 for tp2
            },
            NOT: {
                tps: {
                    some: { tp: { id: 1 } }, // Using id: 1 for tp1
                },
            },
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("year3tp2modules: ", year3tp2modules);

    const year3bothTpModules = await prisma.module.findMany({
        where: {
            yearId: 3,
            tps: {
                some: { tp: { id: 1 } }, // Using id: 1 for tp1
            },
            AND: [
                {
                    tps: {
                        some: { tp: { id: 2 } }, // Using id: 2 for tp2
                    },
                },
            ],
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("year3bothTpModules: ", year3bothTpModules);

    // PG Year modules (Year 4)
    const pgtp1modules = await prisma.module.findMany({
        where: {
            yearId: 4,
            tps: {
                some: { tp: { id: 1 } }, // Using id: 1 for tp1
            },
            NOT: {
                tps: {
                    some: { tp: { id: 2 } }, // Using id: 2 for tp2
                },
            },
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("pgtp1modules: ", pgtp1modules);

    const pgtp2modules = await prisma.module.findMany({
        where: {
            yearId: 4,
            tps: {
                some: { tp: { id: 2 } }, // Using id: 2 for tp2
            },
            NOT: {
                tps: {
                    some: { tp: { id: 1 } }, // Using id: 1 for tp1
                },
            },
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("pgtp2modules: ", pgtp2modules);

    const pgBothTpModules = await prisma.module.findMany({
        where: {
            yearId: 4,
            tps: {
                some: { tp: { id: 1 } }, // Using id: 1 for tp1
            },
            AND: [
                {
                    tps: {
                        some: { tp: { id: 2 } }, // Using id: 2 for tp2
                    },
                },
            ],
        },
        select: {
            id: true,
            code: true,
            name: true,
        },
    });
    console.log("pgBothTpModules: ", pgBothTpModules);

    type moduleType = {
        id: number;
        code: string;
        name: string;
    };

    // Function to map modules into the structure
    async function mapModules(modules: moduleType[]) {
        // Debug: Check if modules array is empty
        console.log("Number of modules:", modules.length);

        const result: Record<
            string,
            {
                Assessments: Record<string, any>;
                "Moderation forms": Record<string, any>;
            }
        > = {};

        for (const module of modules) {
            // Debug: Print module info
            console.log(
                `Processing module: ${module.code} - ${module.name} (ID: ${module.id})`,
            );

            const assessments = await prisma.assessment.findMany({
                where: {
                    module: {
                        id: module.id,
                    },
                },
                select: {
                    id: true,
                    assessmentType: {
                        select: {
                            name: true,
                        },
                    },
                    assessmentCategory: {
                        select: {
                            name: true,
                        },
                    },
                    weight: true,
                },
            });

            // Debug: Check if assessments were found
            console.log(
                `Found ${assessments.length} assessments for module ${module.code}`,
            );

            const assessmentsObj: Record<string, any> = {};

            // Create an entry for each assessment with the required naming convention
            assessments.forEach((assessment) => {
                const assessmentName = `${module.code}_${assessment.assessmentType.name}_${assessment.assessmentCategory.name}_${assessment.weight}`;
                assessmentsObj[assessmentName] = assessment;

                // Debug: Print assessment info
                console.log(`Added assessment: ${assessmentName}`);
            });

            result[`${module.code} - ${module.name}`] = {
                Assessments: assessmentsObj,
                "Moderation forms": {},
            };
        }

        // Debug: Check final result structure
        console.log("Final result structure:", Object.keys(result));

        return result;
    }

    const folderStructure = {
        UG: {
            "Year 1": {
                tp1: await mapModules(year1tp1modules),
                tp2: await mapModules(year1tp2modules),
                "tp1 and tp2": await mapModules(year1bothTpModules),
            },
            "Year 2": {
                tp1: await mapModules(year2tp1modules),
                tp2: await mapModules(year2tp2modules),
                "tp1 and tp2": await mapModules(year2bothTpModules),
            },
            "Year 3": {
                tp1: await mapModules(year3tp1modules),
                tp2: await mapModules(year3tp2modules),
                "tp1 and tp2": await mapModules(year2bothTpModules),
            },
        },
        PG: {
            tp1: await mapModules(pgtp1modules),
            tp2: await mapModules(pgtp2modules),
            "tp1 and tp2": await mapModules(pgBothTpModules),
        },
    };
    console.log(folderStructure);

    const createFoldersRecursively = async (
        parentId: string,
        structure: object,
    ) => {
        try {
            for (const [folderName, subfolders] of Object.entries(structure)) {
                // Create folder using Box API
                const res = await fetch("https://api.box.com/2.0/folders", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${boxAccessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: folderName,
                        parent: { id: parentId },
                    }),
                });

                appAssert(
                    res.status,
                    INTERNAL_SERVER_ERROR,
                    `Failed to create folder: ${folderName}`,
                );

                const data = await res.json();
                logMsg(
                    logType.BOX,
                    `Created folder: ${data.name} (ID: ${data.id})`,
                );

                // Recursively create subfolders if they exist
                if (subfolders && Object.keys(subfolders).length > 0) {
                    await createFoldersRecursively(data.id, subfolders);
                }
            }
            return true;
        } catch (error) {
            logMsg(logType.ERROR, `Error Creating folders: ${error}`);
            return false;
        }
    };

    const boxFoldersCreated = await createFoldersRecursively(
        "0",
        folderStructure,
    );
    return boxFoldersCreated;
};
