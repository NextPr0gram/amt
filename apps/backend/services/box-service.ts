
const { BoxClient, BoxDeveloperTokenAuth } = require("box-typescript-sdk-gen");

const createFoldersRecursively = async (
    parentId: string,
    folderStructure: Record<string, any>,
    client: BoxClient
): Promise<boolean> => {
    try {
        for (const [folderName, subfolders] of Object.entries(folderStructure)) {
            const folder = await client.folders.createFolder({
                name: folderName,
                parent: { id: parentId },
            });

            if (typeof subfolders === 'object') {
                await createFoldersRecursively(folder.id, subfolders, client);
            }
        }
        return true;
    } catch (error) {
        console.error('Error creating folders:', error);
        return false;
    }
};



export const createBoxFolders = async (token: string): Promise<boolean> => {
    const auth = new BoxDeveloperTokenAuth({ token });
    const client = new BoxClient({ auth });
    const folderStructure = {
        folder1: {
            subfolder1: "subfolder1",
            subfolder2: "subfolder2"
        },
        folder2: {
            subfolder1: "subfolder1",
            subfolder2: "subfolder2",
            subfolder3: {
                subfolder1: "subfolder1",
                subfolder2: "subfolder2"
            }
        },
    };
    return await createFoldersRecursively('0', folderStructure, client);
}
