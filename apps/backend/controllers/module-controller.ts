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
    tpIds: z.array(z.number().int()),
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
            tps: {
                select: {
                    tp: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
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
    const { code, tpIds, name, yearId, moduleLeadId, moduleTutors } = moduleSchema.parse(req.body);

    const assignTutors: { userId: number }[] = moduleTutors.map((userId) => ({
        userId,
    }));
    const createModule = await prisma.module.create({
        data: {
            code,
            name,
            yearId,
            moduleLeadId,
            moduleTutors: {
                createMany: { data: assignTutors },
            },
            tps: {
                createMany: { data: tpIds.map((tpId: number) => ({ tpId })) },
            },
        },
    });

    appAssert(createModule, UNPROCESSABLE_CONTENT, "Module with the given ID already exists");

    return res.status(OK).json(createModule);
});

const moduleTpsSchema = z.object({
    moduleId: z
        .string()
        .refine((val) => !isNaN(Number(val)), {
            message: "moduleId must be a number",
        })
        .transform(Number),
});

export const getModuleTpsHandler = catchErrors(async (req, res) => {
    const { moduleId } = moduleTpsSchema.parse(req.query);

    const tps = await prisma.moduleTP.findMany({
        where: {
            moduleId,
        },
        select: {
            tp: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    appAssert(tps, NOT_FOUND, "Tps associated with provided module not found");

    return res.status(OK).json(tps);
});

export const updateModuleHandler = catchErrors(async (req, res) => {
    // Destructure tpIds instead of tpId
    const { id, code, tpIds, name, yearId, moduleLeadId, moduleTutors } = moduleSchemaWithId.parse(req.body);

    // Prepare data for creating new ModuleTutor entries
    const updateAssignTutors: { userId: number }[] = moduleTutors.map((userId) => ({ userId }));
    // Prepare data for creating new ModuleTP entries
    const updateAssignTps: { tpId: number }[] = tpIds.map((tpId) => ({ tpId }));

    // Use a transaction to ensure atomicity
    const [updateModule, deleteModuleTps, createModuleTps, deleteModuleTutors, createModuleTutors] = await prisma.$transaction([
        prisma.module.update({
            where: { id },
            data: {
                code,
                name,
                yearId,
                moduleLeadId,
            },
        }),

        prisma.moduleTP.deleteMany({
            where: {
                moduleId: id,
            },
        }),

        prisma.moduleTP.createMany({
            data: updateAssignTps.map((tp) => ({ ...tp, moduleId: id })),
        }),

        prisma.moduleTutor.deleteMany({
            where: {
                moduleId: id,
            },
        }),

        prisma.moduleTutor.createMany({
            data: updateAssignTutors.map((tutor) => ({ ...tutor, moduleId: id })),
        }),
    ]);

    appAssert(updateModule, NOT_FOUND, "Module not found");

    const updatedModuleWithRelations = await prisma.module.findUnique({
        where: { id },
        include: {
            tps: { include: { tp: true } },
            moduleTutors: { include: { user: true } },
            moduleLead: true,
            year: true,
        },
    });

    return res.status(OK).json(updatedModuleWithRelations);
});
