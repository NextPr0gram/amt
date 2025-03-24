import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import { connectBox, getAuthorizeUrl } from "../services/box-service";
import { broadcastNotification, sendNotification } from "../services/notification-service";
import { getUserIdFromRequest } from "../services/user-service";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";
import { getStateFromToken, getUserIdFromToken } from "../utils/jwt";

// Connect AMT to Box
export const boxConnectHandler = catchErrors(async (req, res) => {
    const userId = getUserIdFromToken(req.cookies.accessToken);
    appAssert(userId, INTERNAL_SERVER_ERROR, "Access token not valid");

    const authorizeUrl = await getAuthorizeUrl(userId);

    return res.status(OK).json({ url: authorizeUrl });
});

export const boxCallbackHandler = catchErrors(async (req, res) => {
    const stateToken = req.query.state as string;
    const authCode = req.query.code as string;
    const userId = getStateFromToken(stateToken);
    appAssert(userId, INTERNAL_SERVER_ERROR, "Could not get user from state");
    const isConnectToBoxSuccessful = await connectBox(userId, authCode);
    appAssert(isConnectToBoxSuccessful, INTERNAL_SERVER_ERROR, "Failed to connect to box");
    sendNotification(userId, "info", "Box connected successfully!");
    return res.status(OK).redirect("http://localhost:3000/dashboard");
});

export const checkBoxConnectedHandler = catchErrors(async (req, res) => {
    const userId = await getUserIdFromRequest(req);
    const boxRefreshToken = await prisma.user.findUnique({
        select: {
            boxRefreshToken: true,
        },
        where: {
            id: userId,
        },
    });
    appAssert(boxRefreshToken, NOT_FOUND, "Box refresh token not found");
    return res.sendStatus(OK);
});
