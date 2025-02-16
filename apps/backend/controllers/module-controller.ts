import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";

export const getModulesHandler = catchErrors(async (req, res) => {
    const modules = await prisma.module.findMany();

    appAssert(modules.length, NOT_FOUND, "Modules not found");
    return res.status(OK).json(modules);
});
