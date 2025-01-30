import { Request } from "express";
import passport from "passport";
// @ts-ignore
import { Strategy as JwtCookieComboStrategy } from "passport-jwt-cookiecombo";
import prisma from "./prisma/primsa-client";

const SECRET_KEY = process.env.SECRET_KEY as string;

passport.use(
    new JwtCookieComboStrategy({ secretOrPublicKey: SECRET_KEY }, async (payload: any, done: any) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: payload.email,
                },
            });
            if (!user) {
                return done(null, false); // No user found
            }

            return done(null, user); // Attach the user object to the request
        } catch (err) {
            console.error("Error during JWT authentication:", err);
            return done(err, false);
        }
    })
);
