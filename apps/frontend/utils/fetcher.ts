// Wrappaer function for fetch that handles token refresh
export const fetcher = async (url: string, method: "GET" | "POST" | "PUT" | "DELETE", body?: Record<string, unknown>) => {
    const fullUrl = process.env.NEXT_PUBLIC_API_URL + url;
    const res = await fetch(fullUrl, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
    });
    return res;
};
