import { NOT_FOUND, OK } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";

export const getYearsHandler = async (req, res) => {
    const years = await prisma.year.findMany();
    appAssert(years, NOT_FOUND, "Years not found");
    return res.status(OK).json(years);
};
