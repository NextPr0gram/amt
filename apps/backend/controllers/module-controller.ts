import { z } from "zod";
import { NOT_FOUND, OK, UNPROCESSABLE_CONTENT } from "../constants/http";
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";

const moduleSchema = z.object({
    code: z
        .string()
        .min(1)
        .max(255)
        .refine((s) => !s.includes(" "), "Id cannot have spaces"),
    name: z.string().min(1).max(255),
    yearId: z.number().int(),
    moduleLeadId: z.number().int(),
    moduleTutors: z.array(z.number().int()),
});

const moduleSchemaWithId = moduleSchema.extend({
    id: z.number().int(),
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
            moduleTutors: {
                select: {
                    userId: true,
                },
            },
        },
    });

    appAssert(modules.length, NOT_FOUND, "Modules not found");
    return res.status(OK).json(modules);
});

export const createModuleHandler = catchErrors(async (req, res) => {
    const { code, name, yearId, moduleLeadId, moduleTutors } = moduleSchema.parse(req.body);
    console.log(moduleTutors);

    const assignTutors: { userId: number }[] = moduleTutors.map((userId) => ({ userId }));
    const createModule = await prisma.module.create({
        data: {
            code,
            name,
            yearId,
            moduleLeadId,
            moduleTutors: {
                createMany: { data: assignTutors },
            },
        },
    });

    appAssert(createModule, UNPROCESSABLE_CONTENT, "Module with the given ID already exists");

    return res.status(OK).json(createModule);
});

export const updateModuleHandler = catchErrors(async (req, res) => {
    const { id, code, name, yearId, moduleLeadId, moduleTutors } = moduleSchemaWithId.parse(req.body);

    const updateAssignTutors: { moduleId: number; userId: number }[] = moduleTutors.map((userId) => ({ moduleId: id, userId }));

    const [updateModule, deleteModuleTutors, createModuleTutors] = await prisma.$transaction([
        prisma.module.update({
            where: { id },
            data: {
                code,
                name,
                yearId,
                moduleLeadId,
            },
        }),
        prisma.moduleTutor.deleteMany({
            where: {
                moduleId: id,
            },
        }),
        prisma.moduleTutor.createMany({
            data: updateAssignTutors,
        }),
    ]);

    appAssert([updateModule, deleteModuleTutors, createModuleTutors], NOT_FOUND, "Module not found");
    return res.status(OK).json(updateModule);
});
