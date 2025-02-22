"use client";

// Wrapper function for fetch that handles token refresh
export const protectedFetch = async (path: string, method: "GET" | "POST", body?: object) => {
    const endpoint = process.env.NEXT_PUBLIC_API_URL + path;
    const opts = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include" as RequestCredentials,
        body: body ? JSON.stringify(body) : undefined,
    };

    const fetchWithToken = async () => {
        return await fetch(endpoint, opts);
    };

    let res = await fetchWithToken();

    const resJson = await res.json();
    // If access token expired then get refresh token
    if (res.status !== 200 && resJson.errorCode === "InvalidAccessToken") {
        const refreshRes = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/refresh", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (refreshRes.status === 200) {
            // Retry the original request with the new token
            res = await fetchWithToken();
            return res.json();
        }

        window.location.href = "/login"; // Redirect to login page
    }
    // return status and resjon
    return { status: res.status, data: resJson };
};
