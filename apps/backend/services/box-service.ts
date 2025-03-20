import { BOX_CLIENT_ID, BOX_CLIENT_SECRET } from "../constants/env";
import { generateStateToken } from "../utils/jwt";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { INTERNAL_SERVER_ERROR } from "../constants/http";
const { BoxClient } = require('box-typescript-sdk-gen/lib/client.generated.js');
import { BoxDeveloperTokenAuth, BoxOAuth, OAuthConfig } from "box-typescript-sdk-gen"
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




// Exchange auth code for tokens
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




export const createBoxFolders = async (token: string) => {
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
    const createFoldersRecursively = async (
        parentId: string,
        folderStructure: Record<string, any>,
        client: typeof BoxClient
    ) => {
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
    return await createFoldersRecursively('0', folderStructure, client);
}
