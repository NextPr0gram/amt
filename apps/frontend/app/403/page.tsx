"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShieldAlert, Home, RotateCcw, Lock, LayoutDashboard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const forbiddenMessages = [
    "Whoa there! This area is off-limits.",
    "Sorry, you don't have a backstage pass for this area.",
    "This content is playing hard to get. You need permission.",
    "Access denied: Your security clearance isn't high enough.",
    "This door is locked, and you don't have the key.",
    "The bouncer says you're not on the list.",
    "This is a VIP area. Your name isn't on the guest list.",
    "You've reached a restricted zone. Turn back, explorer!",
]

export default function Forbidden() {
    const [message, setMessage] = useState<string>("")

    useEffect(() => {
        const randomMessage = forbiddenMessages[Math.floor(Math.random() * forbiddenMessages.length)]
        setMessage(randomMessage)
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="mx-auto max-w-md text-center ">
                <CardHeader>
                    <div className="flex justify-center mb-2">
                        <div className="relative">
                            <Lock className="h-12 w-12 " />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight ">403</h1>
                    <p className="text-xl font-semibold text-muted-foreground">Access Forbidden</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-lg italic">{message}</p>

                    <div className="relative mx-auto aspect-video w-full max-w-sm overflow-hidden rounded-lg bg-red-50">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-red-500">
                            <Lock className="mb-2 h-10 w-10 animate-pulse" />
                            <p className="text-center text-sm">You need permission to view this content</p>
                            <div className="mt-3 w-full max-w-[200px] h-4 bg-red-100 rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-red-400 rounded-full"></div>
                            </div>
                            <p className="text-center text-xs mt-1 ">Security clearance: Insufficient</p>
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

