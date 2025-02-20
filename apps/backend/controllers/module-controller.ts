import { NOT_FOUND, OK, UNPROCESSABLE_CONTENT } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";

export const getModulesHandler = catchErrors(async (req, res) => {
    const modules = await prisma.module.findMany({
        select: {
            id: true,
            name: true,
            moduleLead: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });

    appAssert(modules.length, NOT_FOUND, "Modules not found");
    return res.status(OK).json(modules);
});

export const createModuleHandler = catchErrors(async (req, res) => {
    const { id, name, year, moduleLeadId } = req.body;

    const module = await prisma.module.create({
        data: {
            id,
            name,
            year,
            moduleLeadId,
        },
    });
    appAssert(module, UNPROCESSABLE_CONTENT, "Module with the given ID already exists");

    return res.status(OK).json(module);
});
