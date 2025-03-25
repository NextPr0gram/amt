import { BOX_CLIENT_ID, BOX_CLIENT_SECRET } from "../constants/env";
import { generateStateToken } from "../utils/jwt";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
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

    appAssert(res.ok, INTERNAL_SERVER_ERROR, "Could not exchange authorization code for tokens");

    const data = await res.json();

    appAssert(data.access_token, INTERNAL_SERVER_ERROR, "No access token returned");

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
    appAssert(storeBoxRefreshToken, INTERNAL_SERVER_ERROR, "Something went wrong while trying to store the Box refresh token");

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

    appAssert(res.status, INTERNAL_SERVER_ERROR, "Could not refresh token", AppErrorCode.FailedToRefreshBoxToken, { userId });

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
    appAssert(storeBoxRefreshToken, INTERNAL_SERVER_ERROR, "Something went wrong while trying to store the Box refresh token");
};

const getBoxAccessToken = async (userId: number) => {
    let token = boxAccessTokens.get(userId);

    if (!token || Date.now() > token.expiresIn) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { boxRefreshToken: true },
        });

        appAssert(user?.boxRefreshToken, INTERNAL_SERVER_ERROR, "Refresh token not found");

        await refreshBoxAccessToken(userId, user.boxRefreshToken);
        token = boxAccessTokens.get(userId);
    }

    return token?.accessToken;
};

export const createBoxFolders = async (userId: number) => {
    const boxAccessToken = await getBoxAccessToken(userId);

    const year1tp1modules = await prisma.module.findMany({
        where: { yearId: 1, tp: "tp1" },
        select: { code: true, name: true },
    });
    const year1tp2modules = await prisma.module.findMany({
        where: { yearId: 1, tp: "tp2" },
        select: { code: true, name: true },
    });
    const year2tp1modules = await prisma.module.findMany({
        where: { yearId: 2, tp: "tp1" },
        select: { code: true, name: true },
    });
    const year2tp2modules = await prisma.module.findMany({
        where: { yearId: 2, tp: "tp2" },
        select: { code: true, name: true },
    });
    const year3tp1modules = await prisma.module.findMany({
        where: { yearId: 3, tp: "tp1" },
        select: { code: true, name: true },
    });
    const year3tp2modules = await prisma.module.findMany({
        where: { yearId: 3, tp: "tp2" },
        select: { code: true, name: true },
    });
    const pgtp1modules = await prisma.module.findMany({
        where: { yearId: 4, tp: "tp1" },
        select: { code: true, name: true },
    });
    const pgtp2modules = await prisma.module.findMany({
        where: { yearId: 4, tp: "tp2" },
        select: { code: true, name: true },
    });

    type moduleType = {
        code: string;
        name: string;
    };
    // Function to map modules into the structure
    function mapModules(modules: moduleType[]) {
        return modules.reduce((acc: Record<string, { Assessments: {}; "Moderation forms": {} }>, module: moduleType) => {
            acc[`${module.code} - ${module.name}`] = {
                Assessments: {},
                "Moderation forms": {},
            };
            return acc;
        }, {});
    }

    const folderStructure = {
        UG: {
            "Year 1": {
                tp1: mapModules(year1tp1modules),
                tp2: mapModules(year1tp2modules),
            },
            "Year 2": {
                tp1: mapModules(year2tp1modules),
                tp2: mapModules(year2tp2modules),
            },
            "Year 3": {
                tp1: mapModules(year3tp1modules),
                tp2: mapModules(year3tp2modules),
            },
        },
        PG: {
            tp1: mapModules(pgtp1modules),
            tp2: mapModules(pgtp2modules),
        },
    };

    const createFoldersRecursively = async (parentId: string, structure: object) => {
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

                appAssert(res.status, INTERNAL_SERVER_ERROR, `Failed to create folder: ${folderName}`);

                const data = await res.json();
                logMsg(logType.BOX, `Created folder: ${data.name} (ID: ${data.id})`);

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

    const boxFoldersCreated = await createFoldersRecursively("0", folderStructure);
    await sendNotification(userId, "info", "Box folders created");
    return boxFoldersCreated;
};
