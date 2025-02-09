import type { User, Session } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            userId: User["id"];
            sessionId: Session["id"];
        }
    }
}

export {};
