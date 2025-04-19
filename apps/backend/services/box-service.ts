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
import { getCurrentAcademicYear } from "./moderation-status-service";

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

export const getBoxAccessToken = async (userId: number) => {
    let token = boxAccessTokens.get(userId);

    if (!token || Date.now() > token.expiresIn) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { boxRefreshToken: true },
        });

        appAssert(user?.boxRefreshToken, INTERNAL_SERVER_ERROR, "Box refresh token not found");

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

    type moduleType = {
        id: number;
        code: string;
        name: string;
    };

    // Function to map modules into the structure
    async function mapModules(modules: moduleType[]) {
        const result: Record<string, Record<string, any>> = {};
        const currentAcademicYear = await getCurrentAcademicYear();
        for (const module of modules) {
            const assessments = await prisma.academicYearAssessment.findMany({
                where: {
                    module: {
                        id: module.id,
                    },
                    academicYear: {
                        id: currentAcademicYear.id,
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
                            id: true,
                            name: true,
                        },
                    },
                    weight: true,
                    tp: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            const assessmentsObj: Record<string, any> = {};

            // Track combination of assessment type and category counts
            const typeCategoryCounts: Record<string, number> = {};

            // Create an entry for each assessment with the required naming convention
            assessments.forEach(async (assessment) => {
                // Create a key to track type+category combinations
                const typeKey = `${assessment.assessmentType.name}_${assessment.assessmentCategory.name}_${module.code}`;

                // Initialize counter if not exists
                if (!typeCategoryCounts[typeKey]) {
                    typeCategoryCounts[typeKey] = 0;
                }

                // Increment the counter
                typeCategoryCounts[typeKey]++;

                // Add number suffix if this is not the first occurrence
                const categorySuffix = typeCategoryCounts[typeKey] > 1 ? ` ${typeCategoryCounts[typeKey]}` : " 1";

                const assessmentName = `assessment - ${assessment.tp.name}_${module.code} ${assessment.assessmentType.name} ${assessment.assessmentCategory.name}${categorySuffix} weight: ${Math.round(assessment.weight * 100)}%`;
                assessmentsObj[assessmentName] = assessment;
            });
            result[`${module.code} - ${module.name}`] = assessmentsObj;
        }
        console.log(result);
        for (const moduleKey in result) {
            for (const assessment in result[moduleKey]) {
                const updateAssessment = await prisma.academicYearAssessment.update({
                    where: {
                        id: result[moduleKey][assessment].id,
                    },
                    data: {
                        name: assessment,
                    },
                });
                appAssert(updateAssessment, INTERNAL_SERVER_ERROR, "Could not add name to assessment");
            }
        }
        return result;
    }

    const currentAcademicYear = await getCurrentAcademicYear();

    const folderStructure = {
        [`${String(currentAcademicYear.year)}-${String(currentAcademicYear.year + 1)}`]: {
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
        },
    };
    // delete all folders in box from root folder first
    const cleanupSuccess = await clearFolderContents("0", boxAccessToken);
    if (!cleanupSuccess) {
        return false;
    }
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
                const folderId = data.id;
                logMsg(logType.BOX, `Created folder: ${data.name} (ID: ${folderId})`);

                const isAssessment = folderName.toLowerCase().includes("assessment".toLowerCase());

                if (isAssessment) {
                    // add folderId from box to the assessment record
                    const {
                        id,
                        assessmentCategory: { id: assessmentCategoryId },
                    } = subfolders; // in this case since this is an assessment, subfolders is an assessment object
                    const updateAcademicYearAssessment = await prisma.academicYearAssessment.update({
                        where: {
                            id,
                        },
                        data: {
                            folderId,
                        },
                    });
                    appAssert(updateAcademicYearAssessment, INTERNAL_SERVER_ERROR, "Could not add folderId to assessment");

                    if (assessmentCategoryId === 9) {
                        const createMainFolder = await createSingleBoxFolder(boxAccessToken, folderId, "Main");
                        const createDeferredFolder = await createSingleBoxFolder(boxAccessToken, folderId, "Deferred");
                    }
                }

                // Recursively create subfolders if they exist
                if (!isAssessment && subfolders && Object.keys(subfolders).length > 0) {
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
    return boxFoldersCreated;
};

const clearFolderContents = async (folderIdToClear: string, boxAccessToken: string): Promise<boolean> => {
    logMsg(logType.BOX, `Attempting to clear contents of folder ID: ${folderIdToClear}`);

    try {
        // 1. Get items within the folder
        // Increase limit if you expect more than 1000 items directly in the folder
        // For very large folders, implement pagination using 'marker' from response
        const listUrl = `https://api.box.com/2.0/folders/${folderIdToClear}/items?limit=1000`;

        const listRes = await fetch(listUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${boxAccessToken}`,
            },
        });

        if (!listRes.ok) {
            // Handle cases like folder not found (404) or permission issues (403)
            const errorText = await listRes.text();
            logMsg(logType.ERROR, `Failed to list items in folder ${folderIdToClear}. Status: ${listRes.status}. Response: ${errorText}`);
            return false;
        }

        const listData = await listRes.json();

        if (listData.total_count === 0) {
            logMsg(logType.BOX, `Folder ID: ${folderIdToClear} is already empty.`);
            return true; // Nothing to delete
        }

        logMsg(logType.BOX, `Found ${listData.total_count} items in folder ID: ${folderIdToClear}. Starting deletion...`);

        // 2. Iterate and delete each item
        // Using Promise.all for potentially faster parallel deletion
        // Be mindful of Box API rate limits if deleting a huge number of items quickly
        const deletePromises = listData.entries.map(async (item: any) => {
            let deleteUrl = "";
            const headers = { Authorization: `Bearer ${boxAccessToken}` };
            let success = false;

            try {
                if (item.type === "folder") {
                    // Use recursive delete for folders
                    deleteUrl = `https://api.box.com/2.0/folders/${item.id}?recursive=true`;
                    logMsg(logType.BOX, `Deleting folder: ${item.name} (ID: ${item.id}) recursively`);
                    const deleteRes = await fetch(deleteUrl, {
                        method: "DELETE",
                        headers,
                    });
                    // Successful delete returns 204 No Content
                    success = deleteRes.status === 204;
                    if (!success) {
                        const errorText = await deleteRes.text();
                        logMsg(logType.ERROR, `Failed to delete folder ${item.name} (ID: ${item.id}). Status: ${deleteRes.status}. Response: ${errorText}`);
                    } else {
                        logMsg(logType.BOX, `Successfully deleted folder: ${item.name} (ID: ${item.id})`);
                    }
                } else if (item.type === "file") {
                    deleteUrl = `https://api.box.com/2.0/files/${item.id}`;
                    logMsg(logType.BOX, `Deleting file: ${item.name} (ID: ${item.id})`);
                    const deleteRes = await fetch(deleteUrl, {
                        method: "DELETE",
                        headers,
                    });
                    // Successful delete returns 204 No Content
                    success = deleteRes.status === 204;
                    if (!success) {
                        const errorText = await deleteRes.text();
                        logMsg(logType.ERROR, `Failed to delete file ${item.name} (ID: ${item.id}). Status: ${deleteRes.status}. Response: ${errorText}`);
                    } else {
                        logMsg(logType.BOX, `Successfully deleted file: ${item.name} (ID: ${item.id})`);
                    }
                } else {
                    logMsg(logType.ERROR, `Skipping unknown item type: ${item.type} (Name: ${item.name}, ID: ${item.id})`);
                    success = true; // Consider skipped items as "not failed" for Promise.all
                }
            } catch (error) {
                logMsg(logType.ERROR, `Exception during deletion of ${item.type} ${item.name} (ID: ${item.id}): ${error}`);
                success = false;
            }
            return success;
        });

        // Wait for all delete operations to complete
        const results = await Promise.all(deletePromises);

        // Check if any deletion failed
        const allSucceeded = results.every((result) => result === true);

        if (allSucceeded) {
            logMsg(logType.BOX, `Successfully cleared contents of folder ID: ${folderIdToClear}`);
        } else {
            logMsg(logType.ERROR, `Failed to clear some contents of folder ID: ${folderIdToClear}. Check previous logs.`);
        }

        return allSucceeded;
    } catch (error) {
        logMsg(logType.ERROR, `Error during clearFolderContents for ID ${folderIdToClear}: ${error}`);
        return false;
    }
};

export const createSingleBoxFolder = async (boxAccessToken: string, parentId: string, folderName: string) => {
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
    return data;
};

const checkIfBoxFolderExists = async (name: string, parentId: string, boxAccessToken: string) => {
    logMsg(logType.BOX, `Checking if folder "${name}" exists in parent folder ID: ${parentId}`);
    try {
        const listUrl = `https://api.box.com/2.0/folders/${parentId}/items?fields=id,name,type&limit=1000`; // Request only necessary fields

        const listRes = await fetch(listUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${boxAccessToken}`,
            },
        });

        if (!listRes.ok) {
            const errorText = await listRes.text();
            if (listRes.status === 404) {
                logMsg(logType.ERROR, `Parent folder ID ${parentId} not found when checking for folder "${name}". Status: ${listRes.status}. Response: ${errorText}`);
            } else {
                logMsg(logType.ERROR, `Failed to list items in parent folder ${parentId} when checking for folder "${name}". Status: ${listRes.status}. Response: ${errorText}`);
            }

            return false;
        }

        const listData = await listRes.json();

        for (const item of listData.entries) {
            // Check if the item is a folder and its name matches the target name
            if (item.type === "folder" && item.name === name) {
                logMsg(logType.BOX, `Folder "${name}" found with ID ${item.id} in parent folder ID: ${parentId}`);
                return true; // Folder found
            }
        }

        logMsg(logType.BOX, `Folder "${name}" was not found in parent folder ID: ${parentId}`);
        return false;
    } catch (error) {
        logMsg(logType.ERROR, `Error during checkIfBoxFolderExists for name "${name}" in parent ID ${parentId}: ${error}`);
    }
};

export type BoxCollaborationRole = "editor" | "viewer" | "previewer" | "uploader" | "previewer uploader" | "viewer uploader" | "co-owner" | "owner";

interface BoxCollaborationItem {
    id: string;
    type: "folder";
}

interface BoxAccessibleBy {
    type: "user";

    id?: string;
    login?: string;
}

interface CreateCollaborationBody {
    item: BoxCollaborationItem;
    accessible_by: BoxAccessibleBy;
    role: BoxCollaborationRole;
    can_view_path?: boolean;
    expires_at?: string;
}

interface BoxCollaborationResponse {
    id: string;
    type: "collaboration";
}

export const addFolderCollaborator = async (accessToken: string, folderId: string, userEmail: string, role: BoxCollaborationRole) => {
    const apiUrl = "https://api.box.com/2.0/collaborations";

    const requestBody: CreateCollaborationBody = {
        item: {
            id: folderId,
            type: "folder",
        },
        accessible_by: {
            type: "user",
            login: userEmail,
        },
        role: role,
    };

    logMsg(logType.BOX, `Adding collaborator ${userEmail} to folder ${folderId} with role ${role}`);
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    appAssert(response.ok, INTERNAL_SERVER_ERROR, `Failed to add collaborator: ${userEmail} to folder: ${folderId}`);

    const collaborationData: BoxCollaborationResponse = await response.json();
    logMsg(logType.BOX, `Collaboration created successfully: ${collaborationData.id}`);
    return collaborationData;
};

export const deleteBoxFolder = async (folderId: string, boxAccessToken: string) => {
    const url = `https://api.box.com/2.0/folders/${folderId}`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${boxAccessToken}`,
        },
    });
    console.log(res);
    console.log("res", res.status);
    appAssert(res.status === 204, INTERNAL_SERVER_ERROR, `Failed to delete folder with ID ${folderId}`);
    logMsg(logType.BOX, `Successfully deleted folder with ID ${folderId}`);
    return true;
};

export const getNOfCommentsInFolder = async (userId: number, folderId: string): Promise<number> => {
    const boxAccessToken = await getBoxAccessToken(userId);
    let totalComments = 0;

    const countCommentsRecursive = async (currentFolderId: string, token: string): Promise<number> => {
        let commentsInCurrentScope = 0;
        logMsg(logType.BOX, `Counting comments in folder: ${currentFolderId} (Optimized)`);

        try {
            // 1. Get comments directly on the current folder (still required)
            const folderCommentsUrl = `https://api.box.com/2.0/folders/${currentFolderId}/comments?fields=total_count`;
            const folderCommentsRes = await fetch(folderCommentsUrl, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (folderCommentsRes.ok) {
                const folderCommentsData = await folderCommentsRes.json();
                const folderCommentCount = folderCommentsData.total_count || 0;
                commentsInCurrentScope += folderCommentCount;
                logMsg(logType.BOX, `Found ${folderCommentCount} comments directly on folder ${currentFolderId}`);
            } else {
                const errorText = await folderCommentsRes.text();
                logMsg(logType.ERROR, `Failed to get comments for folder ${currentFolderId}. Status: ${folderCommentsRes.status}. Response: ${errorText}`);
                // Decide how to handle: continue, return error (-1), or throw
            }

            // 2. Get items, requesting comment_count for files directly
            // Use marker-based pagination if folders can exceed 1000 items
            let marker = null;
            do {
                const listUrl = new URL(`https://api.box.com/2.0/folders/${currentFolderId}/items`);
                listUrl.searchParams.append("fields", "type,id,name,comment_count"); // Request comment_count!
                listUrl.searchParams.append("limit", "1000"); // Max limit
                listUrl.searchParams.append("usemarker", "true");
                if (marker) {
                    listUrl.searchParams.append("marker", marker);
                }

                const listRes = await fetch(listUrl.toString(), {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!listRes.ok) {
                    const errorText = await listRes.text();
                    logMsg(logType.ERROR, `Failed to list items in folder ${currentFolderId}. Status: ${listRes.status}. Response: ${errorText}`);
                    appAssert(listRes.ok, INTERNAL_SERVER_ERROR, `Failed to list items in folder ${currentFolderId}`);
                    return commentsInCurrentScope; // Should not be reached
                }

                const listData = await listRes.json();
                marker = listData.next_marker; // For pagination

                // 3. Process items sequentially
                for (const item of listData.entries) {
                    if (item.type === "file") {
                        // Add comment count directly from the item data
                        const fileCommentCount = item.comment_count || 0;
                        commentsInCurrentScope += fileCommentCount;
                        logMsg(logType.BOX, `Found ${fileCommentCount} comments on file ${item.name} (ID: ${item.id}) via item listing`);
                        // *** No separate API call needed for file comments! ***
                    } else if (item.type === "folder") {
                        // Recurse into subfolders
                        logMsg(logType.BOX, `Entering subfolder ${item.name} (ID: ${item.id})`);
                        const commentsInSubfolder = await countCommentsRecursive(item.id, token);
                        commentsInCurrentScope += commentsInSubfolder;
                        logMsg(logType.BOX, `Exiting subfolder ${item.name} (ID: ${item.id}), accumulated ${commentsInSubfolder} comments.`);
                    }
                }
            } while (marker); // Continue if there are more pages
        } catch (error) {
            logMsg(logType.ERROR, `Error processing folder ${currentFolderId} for comments: ${error}`);
            throw error; // Re-throw to indicate failure
        }

        return commentsInCurrentScope;
    };

    try {
        totalComments = await countCommentsRecursive(folderId, boxAccessToken);
        logMsg(logType.BOX, `Total comments found in folder ${folderId} (and subfolders): ${totalComments}`);
    } catch (error) {
        logMsg(logType.ERROR, `Failed to complete comment count for folder ${folderId}: ${error}`);
        return -1; // Indicate error
    }

    return totalComments;
};

export const getNOfFilesInFolder = async (userId: number, folderId: string): Promise<number> => {
    const boxAccessToken = await getBoxAccessToken(userId);
    let totalFiles = 0;

    // Recursive function to traverse folders and count files
    const countFilesRecursive = async (currentFolderId: string, token: string): Promise<number> => {
        let filesInCurrentScope = 0;
        logMsg(logType.BOX, `Counting files in folder: ${currentFolderId}`);

        try {
            // 1. Get items (files and subfolders) in the current folder
            // Consider pagination if a folder might contain > 1000 items
            const listUrl = `https://api.box.com/2.0/folders/${currentFolderId}/items?fields=id,type,name&limit=1000`;
            const listRes = await fetch(listUrl, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!listRes.ok) {
                const errorText = await listRes.text();
                // Special handling for 404 Not Found
                if (listRes.status === 404) {
                    logMsg(logType.ERROR, `Folder ${currentFolderId} not found when counting files. Status: ${listRes.status}. Response: ${errorText}`);
                    appAssert(false, NOT_FOUND, `Folder with ID ${currentFolderId} not found.`);
                } else {
                    logMsg(logType.ERROR, `Failed to list items in folder ${currentFolderId} for file count. Status: ${listRes.status}. Response: ${errorText}`);
                    appAssert(listRes.ok, INTERNAL_SERVER_ERROR, `Failed to list items in folder ${currentFolderId}`);
                }
                return 0; // Should not be reached due to appAssert
            }

            const listData = await listRes.json();

            // 2. Process each item sequentially
            for (const item of listData.entries) {
                if (item.type === "file") {
                    filesInCurrentScope++;
                    logMsg(logType.BOX, `Found file: ${item.name} (ID: ${item.id}) in folder ${currentFolderId}`);
                } else if (item.type === "folder") {
                    // Recursively count files in the subfolder
                    logMsg(logType.BOX, `Entering subfolder ${item.name} (ID: ${item.id}) for file count`);
                    const filesInSubfolder = await countFilesRecursive(item.id, token);
                    filesInCurrentScope += filesInSubfolder;
                    logMsg(logType.BOX, `Exiting subfolder ${item.name} (ID: ${item.id}), found ${filesInSubfolder} files within it.`);
                }
            }
        } catch (error) {
            logMsg(logType.ERROR, `Error processing folder ${currentFolderId} for file count: ${error}`);
            // Re-throw or handle as appropriate
            throw error;
        }

        return filesInCurrentScope;
    };

    try {
        totalFiles = await countFilesRecursive(folderId, boxAccessToken);
        logMsg(logType.BOX, `Total files found in folder ${folderId} (and subfolders): ${totalFiles}`);
    } catch (error) {
        logMsg(logType.ERROR, `Failed to complete file count for folder ${folderId}: ${error}`);
        // Return -1 or throw error based on how the calling function should handle failures
        if (error instanceof Error && error.message.includes("not found")) {
            // Propagate the NOT_FOUND error if it was asserted
            throw error;
        }
        return -1; // Indicate a general error occurred during counting
    }

    return totalFiles;
};
