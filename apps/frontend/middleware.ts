import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const path = request.nextUrl.pathname;

    const publicPaths = ["/login", "/register", "/403"];
    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    const protectedPaths = [
        "/dashboard",
        "/dashboard/review-groups",
        "/dashboard/users",
        "/dashboard/modules",
        "/dashboard/assessments",
        "/dashboard/other",
    ];

    const isProtectedPath = protectedPaths.some(
        (validPath) => path === validPath || path.startsWith(`${validPath}/`),
    );

    if (!isProtectedPath) {
        return NextResponse.next();
    }

    try {
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
        console.log(JSON.stringify({ path }));

        if (roleCheckRes.status !== 200) {
            return NextResponse.redirect(new URL("/403", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|403).*)"],
};
