import { z } from "zod";
import { NOT_FOUND, OK, UNPROCESSABLE_CONTENT } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import catchErrors from "../utils/catch-errors";

const moduleSchema = z.object({
    id: z.number().int(),
    code: z
        .string()
        .min(1)
        .max(255)
        .refine((s) => !s.includes(" "), "Id cannot have spaces"),
    name: z.string().min(1).max(255),
    yearId: z.number().int(),
    moduleLeadId: z.number().int(),
});

export const getModulesHandler = catchErrors(async (req, res) => {
    const modules = await prisma.module.findMany({
        select: {
            id: true,
            code: true,
            name: true,
            year: true,
            moduleLead: {
                select: {
                    id: true,
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
    const { code, name, yearId, moduleLeadId } = moduleSchema.parse(req.body);
    const module = await prisma.module.create({
        data: {
            code,
            name,
            yearId,
            moduleLeadId,
        },
    });

    appAssert(module, UNPROCESSABLE_CONTENT, "Module with the given ID already exists");
    return res.status(OK).json(module);
});

export const updateModuleHandler = catchErrors(async (req, res) => {
    const { id, code, name, yearId, moduleLeadId } = moduleSchema.parse(req.body);

    const module = await prisma.module.update({
        where: { id },
        data: {
            code,
            name,
            yearId,
            moduleLeadId,
        },
    });
    appAssert(module, NOT_FOUND, "Module not found");
    return res.status(OK).json(module);
});
