
"use client";
import { SyntheticEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Loader } from "./ui/loader";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Add loading state, start with true
    const router = useRouter();

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true); // Set loading to true during form submission

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Store cookies
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                router.push("/dashboard");
            } else {
                setError("Invalid credentials");
                setLoading(false); // Only set loading to false if there's an error
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkIfLoggedIn = async () => {
            setLoading(true); // Set loading to true during validation check
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/validate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Store cookies
                });

                if (response.ok) {
                    router.push("/dashboard");
                } else {
                    setLoading(false); // Only set loading to false if user is not logged in
                }
            } catch (err) {
                setLoading(false);
            }
        };

        checkIfLoggedIn();
    }, [router]);

    if (loading) {
        return (
            <div>
                <Loader className="mx-auto" variant="circular" />
                <p className="mt-4 text-center text-md">Checking authentication status...</p>
            </div>
        );
    }

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link href="/dashboard" className="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </Link>
                        </div>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <Button size="sm" type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <RoundSpinner size="sm" color="white" />
                                <span>Logging in...</span>
                            </div>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

