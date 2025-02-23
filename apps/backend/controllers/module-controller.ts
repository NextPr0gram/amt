import { z } from "zod";
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
    const moduleSchema = z.object({
        id: z
            .string()
            .min(1)
            .max(255)
            .refine((s) => !s.includes(" "), "Id cannot have spaces"),
        name: z.string().min(1).max(255),
        year: z.number().int(),
        moduleLeadId: z.number().int(),
    });

    const { id, name, year, moduleLeadId } = moduleSchema.parse(req.body);
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
