/* import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default middleware((request: NextRequest) => {
    console.log("Middleware executed");

    const token = request.cookies.get("token");

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/validate", {
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    });

    if (res.status !== 200) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/dashboard/:path*"],
};
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    console.log(token);
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
            return NextResponse.redirect(new URL("/login", request.url));
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
