import { hashValue } from "../utils/bcrypt";
import prisma from "./primsa-client"; // Ensure the path is correct

const generateRandomPassword = () => {
    return hashValue(Math.random().toString(36).slice(-8));
};

const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
};
async function main() {
    const tps = await prisma.tP.createMany({
        data: [{ name: "TP 1" }, { name: "TP 2" }, { name: "Resit" }, { name: "none" }, { name: "TP 3" }],
    });

    const createusers = await prisma.user.createMany({
        data: [
            {
                email: "n.powell@aston.ac.uk",
                firstName: "Nick",
                lastName: "Powell",
                password: await generateRandomPassword(),
            },
            {
                email: "a.giagkos@aston.ac.uk",
                firstName: "Alexandros",
                lastName: "Giagkos",
                password: await generateRandomPassword(),
            },
            {
                email: "hongxia.wang@aston.ac.uk",
                firstName: "Hongxia (Helen)",
                lastName: "Wang",
                password: await generateRandomPassword(),
            },
            {
                email: "a.j.beaumont@aston.ac.uk",
                firstName: "Tony",
                lastName: "Beaumont",
                password: await generateRandomPassword(),
            },
            {
                email: "r.lee@aston.ac.uk",
                firstName: "Richard",
                lastName: "Lee",
                password: await generateRandomPassword(),
            },
            {
                email: "r.benson@aston.ac.uk",
                firstName: "Roy",
                lastName: "Benson",
                password: await generateRandomPassword(),
            },
            {
                email: "a.htait@aston.ac.uk",
                firstName: "Amal",
                lastName: "Htait",
                password: await generateRandomPassword(),
            },
            {
                email: "m.robertson@aston.ac.uk",
                firstName: "Megan",
                lastName: "Robertson",
                password: await generateRandomPassword(),
            },
            {
                email: "i.masood@aston.ac.uk",
                firstName: "Isma",
                lastName: "Masood",
                password: await generateRandomPassword(),
            },
            {
                email: "l.hakobyan@aston.ac.uk",
                firstName: "Lilit",
                lastName: "Hakobyan",
                password: await generateRandomPassword(),
            },
            {
                email: "s.dar@aston.ac.uk",
                firstName: "Mohit",
                lastName: "Dar",
                password: await generateRandomPassword(),
            },
            {
                email: "p.weber@aston.ac.uk",
                firstName: "Philip",
                lastName: "Weber",
                password: await generateRandomPassword(),
            },
            {
                email: "z.dai@aston.ac.uk",
                firstName: "Zhuangzhuang.",
                lastName: "Dai",
                password: await generateRandomPassword(),
            },
            {
                email: "n.naik@aston.ac.uk",
                firstName: "Nitin",
                lastName: "Naik",
                password: await generateRandomPassword(),
            },
            {
                email: "d.roy@aston.ac.uk",
                firstName: "Debaleen",
                lastName: "Roy",
                password: await generateRandomPassword(),
            },
            {
                email: "h.khan@aston.ac.uk",
                firstName: "Muhammad",
                lastName: "Khan",
                password: await generateRandomPassword(),
            },
            {
                email: "k.fatema@aston.ac.uk",
                firstName: "Kaniz",
                lastName: "Fatema",
                password: await generateRandomPassword(),
            },
            {
                email: "f.campelo@aston.ac.uk",
                firstName: "Fabio",
                lastName: "Campelo",
                password: await generateRandomPassword(),
            },
            {
                email: "r.jose@aston.ac.uk",
                firstName: "Rajive",
                lastName: "Jose",
                password: await generateRandomPassword(),
            },
            {
                email: "t.webber@aston.ac.uk",
                firstName: "Thais",
                lastName: "Webber",
                password: await generateRandomPassword(),
            },
            {
                email: "r.czekster@aston.ac.uk",
                firstName: "Ricardo",
                lastName: "Czekster",
                password: await generateRandomPassword(),
            },
            {
                email: "p.grace@aston.ac.uk",
                firstName: "Paul",
                lastName: "Grace",
                password: await generateRandomPassword(),
            },
            {
                email: "u.bernardet@aston.ac.uk",
                firstName: "Ulysses",
                lastName: "Bernardet",
                password: await generateRandomPassword(),
            },
            {
                email: "m.rudorfer@aston.ac.uk",
                firstName: "Martin",
                lastName: "Rudorfer",
                password: await generateRandomPassword(),
            },
            {
                email: "t.ranasinghe@aston.ac.uk",
                firstName: "Tharindu",
                lastName: "Ranasinghe",
                password: await generateRandomPassword(),
            },
            {
                email: "a.ekart@aston.ac.uk",
                firstName: "Aniko",
                lastName: "Ekart",
                password: await generateRandomPassword(),
            },
            {
                email: "m.bickley@aston.ac.uk",
                firstName: "Matthew",
                lastName: "Bickley",
                password: await generateRandomPassword(),
            },
            {
                email: "a.sowriraghavan@aston.ac.uk",
                firstName: "Abinaya",
                lastName: "Sowriraghavan",
                password: await generateRandomPassword(),
            },
            {
                email: "j.lumsden@aston.ac.uk",
                firstName: "Joanna",
                lastName: "Lumsden",
                password: await generateRandomPassword(),
            },
            {
                email: "l.manso@aston.ac.uk",
                firstName: "Luis",
                lastName: "Manso",
                password: await generateRandomPassword(),
            },
            {
                email: "j.borg@aston.ac.uk",
                firstName: "James",
                lastName: "Borg",
                password: await generateRandomPassword(),
            },
            {
                email: "j.neirotti@aston.ac.uk",
                firstName: "Juan",
                lastName: "Neirotti",
                password: await generateRandomPassword(),
            },
            {
                email: "h.goldingay@aston.ac.uk",
                firstName: "Harry",
                lastName: "Goldingay",
                password: await generateRandomPassword(),
            },
            {
                email: "m.hadi@aston.ac.uk",
                firstName: "Mohammed",
                lastName: "Hadi",
                password: await generateRandomPassword(),
            },
            {
                email: "l.escott@aston.ac.uk",
                firstName: "Liam",
                lastName: "Escott",
                password: await generateRandomPassword(),
            },
            {
                email: "m.childs@aston.ac.uk",
                firstName: "Mary",
                lastName: "Childs",
                password: await generateRandomPassword(),
            },
            {
                email: "e.wanner@aston.ac.uk",
                firstName: "Elizabeth",
                lastName: "Wanner",
                password: await generateRandomPassword(),
            },
            {
                email: "a.karim@aston.ac.uk",
                firstName: "Anaf",
                lastName: "Karim",
                password: await hashValue("password123"),
            },
            {
                email: "a.karim.mt@aston.ac.uk",
                firstName: "Anaf.mt",
                lastName: "Karim",
                password: await hashValue("password123"),
            },
            {
                email: "testuser@test.postman",
                firstName: "Post",
                lastName: "Man",
                password: await hashValue("postman"),
            },
        ],
    });

    const createRoles = await prisma.role.createMany({
        data: [{ name: "Assessment Lead" }, { name: "Module Lead" }, { name: "Module Tutor" }, { name: "Office Staff" }, { name: "External Reviewer" }, { name: "Dev" }, { name: "Moderator" }],
    });

    const AssignRoles = await prisma.userRole.createMany({
        data: [
            { userId: 1, roleId: 3 },
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
            { userId: 38, roleId: 1 },
            { userId: 38, roleId: 3 },
            { userId: 39, roleId: 3 },
            { userId: 40, roleId: 6 },
        ],
    });

    const createYears = await prisma.year.createMany({
        data: [{ name: "Year 1" }, { name: "Year 2" }, { name: "Year 3" }, { name: "Postgraduate" }],
    });

    const reviewGroups = await prisma.reviewGroup.createMany({
        data: [
            { yearId: 1, group: "A", convenerId: 1 },
            { yearId: 2, group: "A", convenerId: 4 },
            { yearId: 2, group: "B", convenerId: 38 },
        ],
    });

    const createModules = await prisma.module.createMany({
        data: [
            {
                code: "CS1IAD",
                name: "Internet Applications and Databases",
                yearId: 1,
                moduleLeadId: 1,
                reviewGroupId: 1,
            },
            {
                code: "CS1OOP",
                name: "Object-Oriented Programming",
                yearId: 1,
                moduleLeadId: 2,
                reviewGroupId: 1,
            },
            {
                code: "CS1PSA",
                name: "Programming and Software Architecture",
                yearId: 1,
                moduleLeadId: 3,
                reviewGroupId: 1,
            },
            {
                code: "CS2HCI",
                name: "Human-Computer Interaction",
                yearId: 2,
                moduleLeadId: 4,
                reviewGroupId: 2,
            },
            {
                code: "CS2IS",
                name: "Information Security",
                yearId: 2,
                moduleLeadId: await getRandomInt(37),
                reviewGroupId: 2,
            },
            {
                code: "CS2IDS",
                name: "Introduction to Distributed Systems",
                yearId: 2,
                moduleLeadId: await getRandomInt(37),
                reviewGroupId: 2,
            },

            {
                code: "CS2OS",
                name: "Operating Systems",
                yearId: 2,
                moduleLeadId: await getRandomInt(37),
                reviewGroupId: 3,
            },
            {
                code: "CS2PLC",
                name: "Programming Language Concepts",
                yearId: 2,
                moduleLeadId: await getRandomInt(37),
                reviewGroupId: 3,
            },
            {
                code: "CS2DSA",
                name: "Data Structures and Algorithms in Java",
                yearId: 2,
                moduleLeadId: 38,
                reviewGroupId: 3,
            },

            {
                code: "CS3IVP",
                name: "Image and Video Processing",
                yearId: 3,
                moduleLeadId: 40,
            },
            {
                code: "CS3ADG",
                name: "Advanced Database Systems and GIS",
                yearId: 3,
                moduleLeadId: await getRandomInt(37),
            },
            {
                code: "CS3DM",
                name: "Data Mining",
                yearId: 3,
                moduleLeadId: await getRandomInt(37),
            },
            {
                code: "CS3ECS",
                name: "Enterprise Computing Strategies",
                yearId: 3,
                moduleLeadId: await getRandomInt(37),
            },
            {
                code: "CS3CA",
                name: "Computer Animation",
                yearId: 3,
                moduleLeadId: await getRandomInt(37),
            },
            {
                code: "CS3GD",
                name: "Game Development",
                yearId: 3,
                moduleLeadId: 6,
            },
            {
                code: "CS4AI",
                name: "Artificial Intelligence",
                yearId: 4,
                moduleLeadId: await getRandomInt(37),
            },
            {
                code: "CS4QC",
                name: "Quantum Computing",
                yearId: 4,
                moduleLeadId: await getRandomInt(37),
            },
            {
                code: "CS3IP",
                name: "Individual Project",
                yearId: 3,
                moduleLeadId: 8,
            },
        ],
    });

    await prisma.moduleTP.createMany({
        data: [
            { moduleId: 1, tpId: 1 }, // CS1IAD
            { moduleId: 2, tpId: 1 }, // CS1OOP
            { moduleId: 3, tpId: 1 }, // CS1PSA
            { moduleId: 4, tpId: 1 }, // CS2HCI
            { moduleId: 5, tpId: 1 }, // CS2IS
            { moduleId: 6, tpId: 1 }, // CS2IDS
            { moduleId: 7, tpId: 1 }, // CS2OS
            { moduleId: 8, tpId: 1 }, // CS2PLC
            { moduleId: 9, tpId: 2 }, // CS3IVP
            { moduleId: 10, tpId: 2 }, // CS3ADG
            { moduleId: 11, tpId: 2 }, // CS3DM
            { moduleId: 12, tpId: 2 }, // CS3ECS
            { moduleId: 13, tpId: 2 }, // CS3CA
            { moduleId: 14, tpId: 2 }, // CS3GD
            { moduleId: 15, tpId: 2 }, // CS4AI
            { moduleId: 16, tpId: 2 }, // CS4QC
            { moduleId: 17, tpId: 1 }, // CS3IP
            { moduleId: 17, tpId: 2 }, // CS3IP
        ],
    });

    const moduleTutors = await prisma.moduleTutor.createMany({
        data: [
            { moduleId: 1, userId: 7 },
            { moduleId: 1, userId: 3 },
            { moduleId: 1, userId: 4 },
            { moduleId: 1, userId: 5 },
            { moduleId: 2, userId: 6 },
            { moduleId: 2, userId: 20 },
            { moduleId: 2, userId: 23 },
            { moduleId: 3, userId: 7 },
            { moduleId: 3, userId: 24 },
            { moduleId: 3, userId: 28 },
            { moduleId: 7, userId: 25 },
            { moduleId: 8, userId: 26 },
            { moduleId: 9, userId: 2 },
            { moduleId: 9, userId: 8 },
        ],
    });

    const assessmentCategory = await prisma.assessmentCategory.createMany({
        data: [{ name: "CA" }, { name: "Project" }, { name: "Coursework" }, { name: "Report" }, { name: "Lit. Review" }, { name: "Presentation" }, { name: "BB Assessment" }, { name: "Quiz" }, { name: "Examination" }, { name: "Portfolio" }, { name: "Refl. Learning" }, { name: "Res. Proposal" }, { name: "Practical" }],
    });

    const assessmentTypes = await prisma.assessmentType.createMany({
        data: [{ name: "Individual" }, { name: "Open-Book" }, { name: "Closed-Book" }, { name: "Group" }],
    });

    const assessments = await prisma.assessment.createMany({
        data: [
            {
                tpId: 1,
                moduleId: 1,
                weight: 0.5,
                assessmentTypeId: 1,
                assessmentCategoryId: 7,
                durationInMinutes: 30,
            },
            {
                tpId: 1,
                moduleId: 1,
                weight: 0.5,
                assessmentTypeId: 1,
                assessmentCategoryId: 9,
                durationInMinutes: 120,
            },
            {
                tpId: 1,
                moduleId: 5,
                weight: 1,
                assessmentTypeId: 3,
                assessmentCategoryId: 1,
            },

            {
                tpId: 1,
                moduleId: 7,
                weight: 0.5,
                assessmentTypeId: 3,
                assessmentCategoryId: 8,
            },
            {
                tpId: 1,
                moduleId: 7,
                weight: 0.5,
                assessmentTypeId: 3,
                assessmentCategoryId: 9,
            },

            {
                tpId: 1,
                moduleId: 8,
                weight: 1,
                assessmentTypeId: 3,
                assessmentCategoryId: 1,
            },
            {
                tpId: 1,
                moduleId: 9,
                weight: 0.1,
                assessmentTypeId: 3,
                assessmentCategoryId: 8,
            },
            {
                tpId: 1,
                moduleId: 9,
                weight: 0.1,
                assessmentTypeId: 3,
                assessmentCategoryId: 8,
            },
            {
                tpId: 1,
                moduleId: 9,
                weight: 0.1,
                assessmentTypeId: 3,
                assessmentCategoryId: 8,
            },
            {
                tpId: 1,
                moduleId: 9,
                weight: 0.7,
                assessmentTypeId: 3,
                assessmentCategoryId: 9,
            },
            {
                tpId: 1,
                moduleId: 10,
                weight: 0.3,
                assessmentTypeId: 3,
                assessmentCategoryId: 8,
            },
            {
                tpId: 1,
                moduleId: 10,
                weight: 0.7,
                assessmentTypeId: 3,
                assessmentCategoryId: 9,
            },
        ],
    });

    const stages = await prisma.stage.createMany({
        data: [{ name: "Stage 1" }, { name: "Stage 2" }, { name: "none" }],
    });

    const reviewTypes = await prisma.reviewType.createMany({
        data: [
            {
                name: "Internal Review",
            },
            {
                name: "External Review",
            },
            {
                name: "No Review",
            },
        ],
    });

    const phaseTriggers = await prisma.phaseTrigger.createMany({
        data: [
            {
                name: "date",
            },
            {
                name: "box-folder-create",
            },
            {
                name: "box-material-upload",
            },
        ],
    });

    const moderationPhases = await prisma.moderationPhase.createMany({
        data: [
            {
                tPId: 4,
                stageId: 3,
                reviewTypeId: 3,
                triggerId: 1,
            },
            {
                tPId: 1,
                stageId: 1,
                reviewTypeId: 3,
                triggerId: 1,
            },
            {
                tPId: 1,
                stageId: 1,
                reviewTypeId: 1,
                triggerId: 2,
            },
            {
                tPId: 1,
                stageId: 1,
                reviewTypeId: 2,
                triggerId: 3,
            },
            {
                tPId: 1,
                stageId: 2,
                reviewTypeId: 3,
                triggerId: 1,
            },
            {
                tPId: 2,
                stageId: 1,
                reviewTypeId: 3,
                triggerId: 1,
            },
            {
                tPId: 2,
                stageId: 1,
                reviewTypeId: 1,
                triggerId: 2,
            },
            {
                tPId: 2,
                stageId: 1,
                reviewTypeId: 2,
                triggerId: 3,
            },
            {
                tPId: 2,
                stageId: 2,
                reviewTypeId: 3,
                triggerId: 1,
            },
            {
                tPId: 3,
                stageId: 2,
                reviewTypeId: 3,
                triggerId: 1,
            },
        ],
    });

    const moderationStatus = await prisma.moderationStatus.create({
        data: {
            moderationPhaseId: 1,
            internalModerationDeadlineTp1: new Date("2025-10-28"),
            externalModerationDeadlineTp1: new Date("2025-11-25"),
            finalDeadlineTp1: new Date("2025-12-30"),
            internalModerationDeadlineTp2: new Date("2026-02-28"),
            externalModerationDeadlineTp2: new Date("2026-03-15"),
            finalDeadlineTp2: new Date("2026-03-29"),
            tp1StartDate: new Date("2025-09-16"),
            tp2StartDate: new Date("2026-01-06"),
            tp2EndDate: new Date("2026-04-30"),
            resitEndDate: new Date("2026-07-25"),
            finalizeReviewGroups: false,
        },
    });

    const DateDemo = await prisma.dateDemo.create({
        data: {
            date: new Date("2025-08-1"),
        },
    });

    const notificationTypes = await prisma.notificationType.createMany({
        data: [{ name: "info" }, { name: "warning" }, { name: "error" }],
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
