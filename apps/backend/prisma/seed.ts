import { hashValue } from "../utils/bcrypt";
import prisma from "./primsa-client"; // Ensure the path is correct

const generateRandomPassword = () => {
    return hashValue(Math.random().toString(36).slice(-8));
};

const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
};
async function main() {
    const createUsers = await prisma.user.createMany({
        data: [
            { email: "n.powell@aston.ac.uk", password: await generateRandomPassword() },
            { email: "a.giagkos@aston.ac.uk", password: await generateRandomPassword() },
            { email: "hongxia.wang@aston.ac.uk", password: await generateRandomPassword() },
            { email: "a.beaumont@aston.ac.uk", password: await generateRandomPassword() },
            { email: "r.lee@aston.ac.uk", password: await generateRandomPassword() },
            { email: "r.benson@aston.ac.uk", password: await generateRandomPassword() },
            { email: "a.htait@aston.ac.uk", password: await generateRandomPassword() },
            { email: "m.robertson@aston.ac.uk", password: await generateRandomPassword() },
            { email: "i.masood@aston.ac.uk", password: await generateRandomPassword() },
            { email: "l.hakobyan@aston.ac.uk", password: await generateRandomPassword() },
            { email: "s.dar@aston.ac.uk", password: await generateRandomPassword() },
            { email: "p.weber@aston.ac.uk", password: await generateRandomPassword() },
            { email: "z.dai@aston.ac.uk", password: await generateRandomPassword() },
            { email: "n.naik@aston.ac.uk", password: await generateRandomPassword() },
            { email: "d.roy@aston.ac.uk", password: await generateRandomPassword() },
            { email: "h.khan@aston.ac.uk", password: await generateRandomPassword() },
            { email: "k.fatema@aston.ac.uk", password: await generateRandomPassword() },
            { email: "f.campelo@aston.ac.uk", password: await generateRandomPassword() },
            { email: "r.jose@aston.ac.uk", password: await generateRandomPassword() },
            { email: "t.webber@aston.ac.uk", password: await generateRandomPassword() },
            { email: "r.czekster@aston.ac.uk", password: await generateRandomPassword() },
            { email: "p.grace@aston.ac.uk", password: await generateRandomPassword() },
            { email: "u.bernardet@aston.ac.uk", password: await generateRandomPassword() },
            { email: "m.rudorfer@aston.ac.uk", password: await generateRandomPassword() },
            { email: "t.ranasinghe@aston.ac.uk", password: await generateRandomPassword() },
            { email: "a.ekart@aston.ac.uk", password: await generateRandomPassword() },
            { email: "m.bickley@aston.ac.uk", password: await generateRandomPassword() },
            { email: "a.sowriraghavan@aston.ac.uk", password: await generateRandomPassword() },
            { email: "j.lumsden@aston.ac.uk", password: await generateRandomPassword() },
            { email: "l.manso@aston.ac.uk", password: await generateRandomPassword() },
            { email: "j.borg@aston.ac.uk", password: await generateRandomPassword() },
            { email: "j.neirotti@aston.ac.uk", password: await generateRandomPassword() },
            { email: "h.goldingay@aston.ac.uk", password: await generateRandomPassword() },
            { email: "m.hadi@aston.ac.uk", password: await generateRandomPassword() },
            { email: "l.escott@aston.ac.uk", password: await generateRandomPassword() },
            { email: "m.chli@aston.ac.uk", password: await generateRandomPassword() },
            { email: "e.wanner@aston.ac.uk", password: await generateRandomPassword() },
        ],
    });

    const createModules = await prisma.module.createMany({
        data: [
            {
                id: "CS1IAD",
                name: "Internet Applications and Databases",
                year: 1,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS1OOP",
                name: "Object-Oriented Programming",
                year: 1,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS1PSA",
                name: "Programming and Software Architecture",
                year: 1,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS2HCI",
                name: "Human-Computer Interaction",
                year: 2,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS2IS",
                name: "Information Security",
                year: 2,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS2IDS",
                name: "Introduction to Distributed Systems",
                year: 2,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS2OS",
                name: "Operating Systems",
                year: 2,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS2PLC",
                name: "Programming Language Concepts",
                year: 2,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3IVP",
                name: "Image and Video Processing",
                year: 3,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3ADG",
                name: "Advanced Database Systems and GIS",
                year: 3,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3DM",
                name: "Data Mining",
                year: 3,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3ECS",
                name: "Enterprise Computing Strategies",
                year: 3,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3CA",
                name: "Computer Animation",
                year: 3,
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3GD",
                name: "Game Development",
                year: 3,
                moduleLeadId: await getRandomInt(37),
            },
        ],
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
