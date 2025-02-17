import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const path = request.nextUrl.pathname;

    // Public routes that don't require authentication
    const publicPaths = ["/login", "/register"];

    // Check if the path is public
    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    // If no token exists, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
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
            const resJson = await res.json();
            if (resJson.message === "InvalidAccessToken" && refreshToken) {
                try {
                    const refreshRes = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/refresh", {
                        method: "GET",
                        headers: {
                            cookie: `refreshToken=${refreshToken}`,
                        },
                        credentials: "include",
                    });

                    if (refreshRes.status === 200) {
                        const refreshJson = await refreshRes.json();
                        const newAccessToken = refreshJson.accessToken;

                        // Set the new access token in the response cookies
                        const response = NextResponse.next();
                        response.cookies.set("accessToken", newAccessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                        });

                        return response;
                    } else {
                        return NextResponse.redirect(new URL("/login", request.url));
                    }
                } catch (error) {
                    console.log(error);
                    return NextResponse.redirect(new URL("/login", request.url));
                }
            } else {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.log(error);
        // Handle any verification errors
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
