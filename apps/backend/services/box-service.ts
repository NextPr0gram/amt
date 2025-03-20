import { Record } from "@prisma/client/runtime/library";
import { BOX_CLIENT_ID, BOX_CLIENT_SECRET } from "../constants/env";
import { generateStateToken } from "../utils/jwt";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { INTERNAL_SERVER_ERROR } from "../constants/http";
const { BoxClient, BoxDeveloperTokenAuth, BoxOAuth, OAuthConfig } = require("box-typescript-sdk-gen");

const boxAccessTokens = new Map<number, object>();

const oauthConfig = new OAuthConfig({
    clientId: BOX_CLIENT_ID,
    clientSecret: BOX_CLIENT_SECRET,
});

const oauth = new BoxOAuth({ config: oauthConfig });

// Get the Box Authorization URL
export const getAuthorizeUrl = (userId: number) => {
    const state = generateStateToken(userId)
    return oauth.getAuthorizeUrl({
        redirectUri: "http://localhost:5000/api/v1/box/callback",
        responseType: "code",
        clientId: BOX_CLIENT_ID,
        state,
    });
};

// Exchange auth code for access token
export const getClient = async (authorizationCode: string) => {
    const tokenInfo = await oauth?.getTokensAuthorizationCodeGrant(authorizationCode)
    return new BoxClient({
        accessToken: tokenInfo.access_token,
        refreshToken: tokenInfo.refresh_token,
    });
};


export const connectBox = async (userId: number, authorizationCode: string) => {
    const tokens = await oauth?.getTokensAuthorizationCodeGrant(authorizationCode)
    const accessTokenInfo = { accessToken: tokens.accessToken, expiresIn: new Date(Date.now() + tokens.expiresIn * 1000) }
    boxAccessTokens.set(userId, accessTokenInfo)
    const boxRefreshToken = await prisma.user.update({
        where: { id: userId },
        data: { boxRefreshToken: tokens.refreshToken },
    });
    appAssert(boxRefreshToken, INTERNAL_SERVER_ERROR, "Failed to store Box refresh token in database")

    return true
};

const createFoldersRecursively = async (
    parentId: string,
    folderStructure: Record<string, any>,
    client: BoxClient
): Promise<boolean> => {
    try {
        for (const [folderName, subfolders] of Object.entries(folderStructure)) {
            const folder = await client.folders.createFolder({
                name: folderName,
                parent: { id: parentId },
            });

            if (typeof subfolders === 'object') {
                await createFoldersRecursively(folder.id, subfolders, client);
            }
        }
        return true;
    } catch (error) {
        console.error('Error creating folders:', error);
        return false;
    }
};



export const createBoxFolders = async (token: string): Promise<boolean> => {
    const auth = new BoxDeveloperTokenAuth({ token });
    const client = new BoxClient({ auth });
    const folderStructure = {
        folder1: {
            subfolder1: "subfolder1",
            subfolder2: "subfolder2"
        },
        folder2: {
            subfolder1: "subfolder1",
            subfolder2: "subfolder2",
            subfolder3: {
                subfolder1: "subfolder1",
                subfolder2: "subfolder2"
            }
        },
    };
    return await createFoldersRecursively('0', folderStructure, client);
}
