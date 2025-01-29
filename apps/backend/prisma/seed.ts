import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const alexandros = await prisma.user.create({
        data: {
            email: "a.giagkos@aston.ac.uk",
            name: "Alexandros",
            surname: "Giagkos",
        },
    });

    const ivp = await prisma.module.create({
        data: {
            id: "CS3IVP",
            name: "Image and Video Processing",
        },
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
