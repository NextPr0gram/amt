import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const path = request.nextUrl.pathname;

    // Public routes that don't require authentication
    const publicPaths = ["/login", "/register"];

    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    try {
        // Verify the token with external API
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/validate", {
            method: "POST",
            headers: {
                cookie: `accessToken=${token}`,
            },
        });
        if (res.status !== 200) {
            // If token is invalid or does not exist try refreshing
            if (refreshToken) {
                const refreshRes = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/refresh", {
                    method: "GET",
                    headers: {
                        cookie: `refreshToken=${refreshToken}`,
                    },
                });

                if (refreshRes.status === 200) {
                    const newToken = refreshRes.headers.get("set-cookie")?.match(/accessToken=([^;]+)/)?.[1];
                    if (newToken) {
                        // Set new accessToken in the response
                        const response = NextResponse.next();
                        response.cookies.set("accessToken", newToken, { httpOnly: true });
                        return response;
                    }
                }
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
