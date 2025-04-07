import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const path = request.nextUrl.pathname;

    // Public routes that don't require authentication
    const publicPaths = ["/login", "/register", "/403"];
    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    // Define valid application paths that should be protected
    // This should match your pathRoleMap on the backend
    const protectedPaths = [
        "/dashboard",
        "/dashboard/review-groups",
        "/dashboard/users",
        "/dashboard/modules",
        "/dashboard/assessments",
        "/dashboard/other",
        // Add other protected paths here
    ];

    // Check if the current path should be protected
    const isProtectedPath = protectedPaths.some(
        (validPath) => path === validPath || path.startsWith(`${validPath}/`),
    );

    // If it's not a protected path, let Next.js handle it (will render 404 for non-existent paths)
    if (!isProtectedPath) {
        return NextResponse.next();
    }

    try {
        // Verify the token with external API
        const res = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/auth/validate",
            {
                method: "POST",
                headers: {
                    cookie: `accessToken=${token}`,
                },
            },
        );

        if (res.status !== 200) {
            // If token is invalid or does not exist try refreshing
            if (refreshToken) {
                const refreshRes = await fetch(
                    process.env.NEXT_PUBLIC_API_URL + "/auth/refresh",
                    {
                        method: "GET",
                        headers: {
                            cookie: `refreshToken=${refreshToken}`,
                        },
                    },
                );

                if (refreshRes.status === 200) {
                    const newToken = refreshRes.headers
                        .get("set-cookie")
                        ?.match(/accessToken=([^;]+)/)?.[1];

                    if (newToken) {
                        // Set new accessToken in the response
                        const response = NextResponse.next();
                        response.cookies.set("accessToken", newToken, {
                            httpOnly: true,
                        });
                        return response;
                    }
                }
            }

            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Check if the user is authorized for the requested page
        const roleCheckRes = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/authorize-page",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    cookie: `accessToken=${token}`,
                },
                body: JSON.stringify({ path }),
            },
        );

        if (roleCheckRes.status !== 200) {
            // If the user is not authorized, deny access
            return NextResponse.redirect(new URL("/403", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|403).*)"],
};
