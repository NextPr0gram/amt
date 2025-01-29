const { BoxClient, BoxDeveloperTokenAuth } = require("box-typescript-sdk-gen");
import { Prisma, PrismaClient } from '@prisma/client'

// start the webserver
const express = require("express");
const app = express();
const port = 3000;
const prisma = new PrismaClient()

app.get("/", (req: any, res: any) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

/* async function main(token) {
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
}

main('omR5Tn7yjF9YmnTa3sLhzTXuCFYydnuN'); */

