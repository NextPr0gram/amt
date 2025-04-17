import { z } from "zod";
import { BAD_REQUEST, CONFLICT, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http"; // Added CONFLICT, CREATED
import prisma from "../prisma/primsa-client";
import appAssert from "../utils/app-assert";
import { catchErrors } from "../utils/catch-errors";
import { getUserIdFromToken } from "../utils/jwt";
import { addFolderCollaborator, BoxCollaborationRole, createSingleBoxFolder, deleteBoxFolder, getBoxAccessToken } from "../services/box-service";
import { logMsg, logType } from "../utils/logger";
import AppErrorCode from "../constants/app-error-code";

export const getErFoldersHandler = catchErrors(async (req, res) => {
    /* 
    model Er {
    id       Int     @id @default(autoincrement())
    email    String  @unique
    folderId String?
}

    */
    const ers = await prisma.er.findMany({
        select: {
            id: true,
            email: true,
            folderId: true,
        },
    });
    appAssert(ers, NOT_FOUND, "ERs not found");
    return res.status(OK).json(ers);
});

const createErFolderHandlerRequestSchema = z.object({
    email: z.string().email(),
});

// create zod schema for request body

export const createErFolderHandler = catchErrors(async (req, res) => {
    const { email } = createErFolderHandlerRequestSchema.parse(req.body);
    const userId = getUserIdFromToken(req.cookies.accessToken);
    appAssert(userId, INTERNAL_SERVER_ERROR, "User ID is missing or invalid");

    const existingEr = await prisma.er.findUnique({
        where: { email },
    });
    appAssert(!existingEr, CONFLICT, `External reviewer with this email already exists`, AppErrorCode.ResourceAlreadyExists);

    const boxAccessToken = await getBoxAccessToken(userId);
    appAssert(boxAccessToken, INTERNAL_SERVER_ERROR, "Could not obtain Box access token");

    const erFolderName = "External Reviewers";
    let erParentFolderId: string | null = null;

    // Check ModerationStatus table first
    const moderationStatus = await prisma.moderationStatus.findUnique({
        where: { id: 1 },
        select: { erFolderId: true },
    });

    appAssert(moderationStatus, INTERNAL_SERVER_ERROR, "Moderation status not found");

    if (moderationStatus?.erFolderId) {
        erParentFolderId = moderationStatus.erFolderId;
        logMsg(logType.MODERATION, `Found existing ER parent folder ID: ${erParentFolderId}`);
    } else {
        logMsg(logType.BOX, `ER parent folder ID not found in database. Creating "${erFolderName}" folder in Box root.`);
        const newParentFolder = await createSingleBoxFolder(boxAccessToken, "0", erFolderName);
        appAssert(newParentFolder, INTERNAL_SERVER_ERROR, `Failed to create "${erFolderName}" folder in Box`);
        erParentFolderId = newParentFolder.id;

        await prisma.moderationStatus.update({
            where: { id: 1 },
            data: { erFolderId: erParentFolderId },
        });
        logMsg(logType.MODERATION, `Stored new ER parent folder ID: ${erParentFolderId} in database.`);
    }

    // 4. Create ER-Specific Folder (named with email)
    appAssert(erParentFolderId, INTERNAL_SERVER_ERROR, "ER Parent Folder ID is missing"); // Should not happen, but check anyway
    const erSpecificFolderName = email; // Use email as the folder name
    const erSpecificFolder = await createSingleBoxFolder(boxAccessToken, erParentFolderId, erSpecificFolderName);
    appAssert(erSpecificFolder, INTERNAL_SERVER_ERROR, `Failed to create folder for ${email} in Box`);
    const erSpecificFolderId = erSpecificFolder.id;

    // 5. Add Collaborator
    const collaborationRole: BoxCollaborationRole = "viewer"; // Or choose another role like "viewer uploader"
    const collaboration = await addFolderCollaborator(boxAccessToken, erSpecificFolderId, email, collaborationRole);
    appAssert(collaboration, INTERNAL_SERVER_ERROR, `Failed to add ${email} as collaborator to folder ${erSpecificFolderId}`);

    // 6. Create ER Record in Database
    const newEr = await prisma.er.create({
        data: {
            email: email,
            folderId: erSpecificFolderId,
        },
    });
    appAssert(newEr, INTERNAL_SERVER_ERROR, "Failed to create ER record in database");

    // 7. Return Response
    logMsg(logType.MODERATION, `Successfully created ER folder and record for ${email}`);
    return res.status(CREATED).json({
        id: newEr.id,
        email: newEr.email,
        folderId: newEr.folderId,
    });
});

export const deleteErFolderHandler = catchErrors(async (req, res) => {
    const { id } = req.body;
    const userId = getUserIdFromToken(req.cookies.accessToken);
    appAssert(userId, INTERNAL_SERVER_ERROR, "User ID is missing or invalid");

    const er = await prisma.er.findUnique({
        where: { id: Number(id) },
        select: { folderId: true },
    });
    appAssert(er, NOT_FOUND, `ER with ID ${id} not found`);

    // 3. Delete ER Folder from Box
    const boxAccessToken = await getBoxAccessToken(userId);
    appAssert(boxAccessToken, INTERNAL_SERVER_ERROR, "Could not obtain Box access token");

    const deletedFolder = await deleteBoxFolder(er.folderId, boxAccessToken);
    appAssert(deletedFolder, INTERNAL_SERVER_ERROR, `Failed to delete folder ${er.folderId} in Box`);

    await prisma.er.delete({
        where: { id: Number(id) },
    });

    logMsg(logType.MODERATION, `Successfully deleted ER folder and record for ${er.email}`);
    return res.status(OK).json({ message: `ER folder and record for ${er.email} deleted successfully` });
});
