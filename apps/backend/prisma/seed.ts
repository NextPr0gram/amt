import prisma from "./primsa-client"; // Ensure the path is correct

async function main() {
    /* const alexandros = await prisma.user.create({
        data: {
            email: "a.karim@aston.ac.uk",
            name: "Anaf",
            surname: "Karim",
        },
    }); */

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
