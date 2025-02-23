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
            { email: "n.powell@aston.ac.uk", firstName: "Nick", lastName: "Powell", password: await generateRandomPassword() },
            { email: "a.giagkos@aston.ac.uk", firstName: "Alexandros", lastName: "Giagkos", password: await generateRandomPassword() },
            { email: "hongxia.wang@aston.ac.uk", firstName: "Hongxia (Helen)", lastName: "Wang", password: await generateRandomPassword() },
            { email: "a.j.beaumont@aston.ac.uk", firstName: "Tony", lastName: "Beaumont", password: await generateRandomPassword() },
            { email: "r.lee@aston.ac.uk", firstName: "Richard", lastName: "Lee", password: await generateRandomPassword() },
            { email: "r.benson@aston.ac.uk", firstName: "Roy", lastName: "Benson", password: await generateRandomPassword() },
            { email: "a.htait@aston.ac.uk", firstName: "Amal", lastName: "Htait", password: await generateRandomPassword() },
            { email: "m.robertson@aston.ac.uk", firstName: "Megan", lastName: "Robertson", password: await generateRandomPassword() },
            { email: "i.masood@aston.ac.uk", firstName: "Isma", lastName: "Masood", password: await generateRandomPassword() },
            { email: "l.hakobyan@aston.ac.uk", firstName: "Lilit", lastName: "Hakobyan", password: await generateRandomPassword() },
            { email: "s.dar@aston.ac.uk", firstName: "Mohit", lastName: "Dar", password: await generateRandomPassword() },
            { email: "p.weber@aston.ac.uk", firstName: "Philip", lastName: "Weber", password: await generateRandomPassword() },
            { email: "z.dai@aston.ac.uk", firstName: "Zhuangzhuang.", lastName: "Dai", password: await generateRandomPassword() },
            { email: "n.naik@aston.ac.uk", firstName: "Nitin", lastName: "Naik", password: await generateRandomPassword() },
            { email: "d.roy@aston.ac.uk", firstName: "Debaleen", lastName: "Roy", password: await generateRandomPassword() },
            { email: "h.khan@aston.ac.uk", firstName: "Muhammad", lastName: "Khan", password: await generateRandomPassword() },
            { email: "k.fatema@aston.ac.uk", firstName: "Kaniz", lastName: "Fatema", password: await generateRandomPassword() },
            { email: "f.campelo@aston.ac.uk", firstName: "Fabio", lastName: "Campelo", password: await generateRandomPassword() },
            { email: "r.jose@aston.ac.uk", firstName: "Rajive", lastName: "Jose", password: await generateRandomPassword() },
            { email: "t.webber@aston.ac.uk", firstName: "Thais", lastName: "Webber", password: await generateRandomPassword() },
            { email: "r.czekster@aston.ac.uk", firstName: "Ricardo", lastName: "Czekster", password: await generateRandomPassword() },
            { email: "p.grace@aston.ac.uk", firstName: "Paul", lastName: "Grace", password: await generateRandomPassword() },
            { email: "u.bernardet@aston.ac.uk", firstName: "Ulysses", lastName: "Bernardet", password: await generateRandomPassword() },
            { email: "m.rudorfer@aston.ac.uk", firstName: "Martin", lastName: "Rudorfer", password: await generateRandomPassword() },
            { email: "t.ranasinghe@aston.ac.uk", firstName: "Tharindu", lastName: "Ranasinghe", password: await generateRandomPassword() },
            { email: "a.ekart@aston.ac.uk", firstName: "Aniko", lastName: "Ekart", password: await generateRandomPassword() },
            { email: "m.bickley@aston.ac.uk", firstName: "Matthew", lastName: "Bickley", password: await generateRandomPassword() },
            { email: "a.sowriraghavan@aston.ac.uk", firstName: "Abinaya", lastName: "Sowriraghavan", password: await generateRandomPassword() },
            { email: "j.lumsden@aston.ac.uk", firstName: "Joanna", lastName: "Lumsden", password: await generateRandomPassword() },
            { email: "l.manso@aston.ac.uk", firstName: "Luis", lastName: "Manso", password: await generateRandomPassword() },
            { email: "j.borg@aston.ac.uk", firstName: "James", lastName: "Borg", password: await generateRandomPassword() },
            { email: "j.neirotti@aston.ac.uk", firstName: "Juan", lastName: "Neirotti", password: await generateRandomPassword() },
            { email: "h.goldingay@aston.ac.uk", firstName: "Harry", lastName: "Goldingay", password: await generateRandomPassword() },
            { email: "m.hadi@aston.ac.uk", firstName: "Mohammed", lastName: "Hadi", password: await generateRandomPassword() },
            { email: "l.escott@aston.ac.uk", firstName: "Liam", lastName: "Escott", password: await generateRandomPassword() },
            { email: "m.childs@aston.ac.uk", firstName: "Mary", lastName: "Childs", password: await generateRandomPassword() },
            { email: "e.wanner@aston.ac.uk", firstName: "Elizabeth", lastName: "Wanner", password: await generateRandomPassword() },
        ],
    });

    const createRoles = await prisma.role.createMany({
        data: [{ name: "Assessment Lead" }, { name: "Module Lead" }, { name: "Module Tutor" }, { name: "Office Staff" }, { name: "External Revier" }],
    });

    const AssignRoles = await prisma.userRole.createMany({
        data: [
            { userId: 1, roleId: 3 },
            { userId: 2, roleId: 1 },
            { userId: 2, roleId: 2 },
            { userId: 2, roleId: 3 },
            { userId: 3, roleId: 3 },
            { userId: 4, roleId: 3 },
            { userId: 5, roleId: 3 },
            { userId: 6, roleId: 3 },
            { userId: 7, roleId: 3 },
            { userId: 8, roleId: 3 },
            { userId: 8, roleId: 2 },
            { userId: 9, roleId: 3 },
            { userId: 10, roleId: 3 },
            { userId: 11, roleId: 3 },
            { userId: 12, roleId: 3 },
            { userId: 13, roleId: 3 },
            { userId: 14, roleId: 3 },
            { userId: 15, roleId: 3 },
            { userId: 16, roleId: 3 },
            { userId: 17, roleId: 3 },
            { userId: 17, roleId: 2 },
            { userId: 18, roleId: 3 },
            { userId: 19, roleId: 3 },
            { userId: 20, roleId: 3 },
            { userId: 21, roleId: 3 },
            { userId: 22, roleId: 3 },
            { userId: 22, roleId: 2 },
            { userId: 23, roleId: 3 },
            { userId: 24, roleId: 3 },
            { userId: 24, roleId: 2 },
            { userId: 25, roleId: 3 },
            { userId: 26, roleId: 3 },
            { userId: 27, roleId: 3 },
            { userId: 28, roleId: 3 },
            { userId: 29, roleId: 3 },
            { userId: 30, roleId: 3 },
            { userId: 31, roleId: 3 },
            { userId: 31, roleId: 2 },
            { userId: 32, roleId: 3 },
            { userId: 33, roleId: 3 },
            { userId: 33, roleId: 2 },
            { userId: 34, roleId: 3 },
            { userId: 35, roleId: 3 },
            { userId: 36, roleId: 3 },
            { userId: 37, roleId: 3 },
        ],
    });

    const createModules = await prisma.module.createMany({
        data: [
            {
                id: "CS1IAD",
                name: "Internet Applications and Databases",
                year: "1",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS1OOP",
                name: "Object-Oriented Programming",
                year: "1",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS1PSA",
                name: "Programming and Software Architecture",
                year: "1",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS2HCI",
                name: "Human-Computer Interaction",
                year: "2",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS2IS",
                name: "Information Security",
                year: "2",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS2IDS",
                name: "Introduction to Distributed Systems",
                year: "2",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS2OS",
                name: "Operating Systems",
                year: "2",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS2PLC",
                name: "Programming Language Concepts",
                year: "2",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3IVP",
                name: "Image and Video Processing",
                year: "3",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3ADG",
                name: "Advanced Database Systems and GIS",
                year: "3",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3DM",
                name: "Data Mining",
                year: "3",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3ECS",
                name: "Enterprise Computing Strategies",
                year: "3",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3CA",
                name: "Computer Animation",
                year: "3",
                moduleLeadId: await getRandomInt(37),
            },
            {
                id: "CS3GD",
                name: "Game Development",
                year: "3",
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
