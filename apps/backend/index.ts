import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response, Application } from "express";
const { BoxClient, BoxDeveloperTokenAuth } = require("box-typescript-sdk-gen");

// start the webserver
const app: Application = express();
const port = 3000;
const prisma = new PrismaClient();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get("/users", async (req: Request, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
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

// function express() {
//     throw new Error("Function not implemented.");
// }
