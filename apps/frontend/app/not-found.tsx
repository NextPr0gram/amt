"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Compass, Home, LayoutDashboard, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// Array of funny messages to display randomly
const funnyMessages = [
    "Looks like you've wandered into the digital wilderness!",
    "This page is playing hide and seek. And it's winning.",
    "Houston, we have a problem. Page not found!",
    "Oops! The page you're looking for is on vacation.",
    "This page has gone fishing. It might be back later.",
    "404: Page got lost during quantum teleportation.",
    "You've reached the edge of the internet. Turn back now!",
    "This page exists in another dimension. Try again later.",
]

export default function NotFound() {
    const [message, setMessage] = useState<string>("")

    useEffect(() => {
        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
        setMessage(randomMessage)
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="mx-auto max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-2">
                        <Compass className="h-12 w-12 text-muted-foreground animate-[spin_10s_linear_infinite]" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
                    <p className="text-xl font-semibold text-muted-foreground">Page Not Found</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-lg italic">{message}</p>

                    {/* Placeholder for funny image */}
                    <div className="relative mx-auto aspect-video w-full max-w-sm overflow-hidden rounded-lg bg-muted">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-muted-foreground">
                            <RotateCcw className="mb-2 h-8 w-8 animate-spin" />
                            <p className="text-center text-sm">Funny image loading...</p>
                            <p className="text-center text-xs mt-1">(or maybe it's lost too)</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button asChild>
                        <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

