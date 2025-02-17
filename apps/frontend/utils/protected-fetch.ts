"use client";

// Wrapper function for fetch that handles token refresh
export const protectedFetch = async (url: string, opts: object) => {
    const fullUrl = process.env.NEXT_PUBLIC_API_URL + url;

    const fetchWithToken = async () => {
        return await fetch(fullUrl, opts);
    };

    let res = await fetchWithToken();

    // If access token expired then get refresh token
    if (res.status !== 200) {
        const refreshRes = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/refresh", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (refreshRes.status === 200) {
            console.log("Access token refreshed");
            // Retry the original request with the new token
            res = await fetchWithToken();
            return res.json();
        }

        window.location.href = "/login"; // Redirect to login page
    }

    return res;
};
