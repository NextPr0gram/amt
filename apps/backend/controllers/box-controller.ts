import { OK } from "../constants/http";
import { connectBox, getAuthorizeUrl, getClient } from "../services/box-service";
import catchErrors from "../utils/catch-errors";

export const boxConnectHandler = catchErrors(async (req, res) => {
    const authorizeUrl = getAuthorizeUrl();
    res.status(OK).json({ url: authorizeUrl });
})

export const boxCallbackHandler = catchErrors(async (req, res) => {
    const authCode = req.query.code as string;
    if (!authCode) return res.status(400).json({ error: "Authorization code is required" });

    const client = await getClient(authCode);
    console.log("client connected", client)
    res.status(OK).redirect("http://localhost:3000/dashboard")
});
