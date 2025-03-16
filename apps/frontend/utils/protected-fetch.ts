"use client";

import { toast } from "sonner";

// Wrapper function for fetch that handles token refresh
export const protectedFetch = async (path: string, method: "GET" | "POST" | "PATCH" | "DELETE", body?: object) => {
    const endpoint = process.env.NEXT_PUBLIC_API_URL + path;
    const opts = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include" as RequestCredentials,
        body: body ? JSON.stringify(body) : undefined,
    };
    const parseJson = async (res: Response) => {
        const text = await res.text()
        try {
            const json = JSON.parse(text)
            return json
        } catch (err) {
        }
    }
    const fetchWithToken = async () => {
        try {
            const res = await fetch(endpoint, opts);
            return res;
        } catch (err) {
            toast.error("Network error", {
                description: "Network error occurred while making the request"
            })
            return { status: 500, text: () => Promise.resolve("") } as Response;


        }

    };
    let res = await fetchWithToken();
    let resJson = await parseJson(res)


    // If access token expired then get refresh token
    if (res.status !== 200 && resJson && resJson.errorCode === "InvalidAccessToken") {
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
            resJson = await parseJson(res)
        } else {
            window.location.href = "/login"; // Redirect to login page
        }
    }
    // return status and resjon
    return { status: res.status, data: resJson };
};
