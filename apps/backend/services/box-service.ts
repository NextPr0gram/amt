const { BoxClient, BoxDeveloperTokenAuth } = require("box-typescript-sdk-gen");

export const createBoxFolders = async (token) => {
    let auth = new BoxDeveloperTokenAuth({ token });
    let client = new BoxClient({ auth });
    let entries = (await client.folders.getFolderItems('0')).entries;
    entries.forEach((entry) => console.log(entry));

    // Create 2 folders
    await client.folders.createFolder({
        name: 'folder-created-by-backend-one',
        parent: { id: '0' } satisfies CreateFolderRequestBodyParentField,
    } satisfies CreateFolderRequestBody);

    await client.folders.createFolder({
        name: 'folder-created-by-backend-two',
        parent: { id: '0' } satisfies CreateFolderRequestBodyParentField,
    } satisfies CreateFolderRequestBody);
    return true
}
