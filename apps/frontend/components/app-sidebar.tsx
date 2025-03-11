"use client";

import * as React from "react";
import { Command, Settings, Component, Users, UserRoundPen, BookOpenText, Info, Bell } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { protectedFetch } from "@/utils/protected-fetch";
import { useEffect, useState } from "react";
import Notification from "@/components/notification";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

// Menu items.
const items = [
    {
        title: "Modules",
        url: "/dashboard/modules",
        icon: Component,
    },
    {
        title: "Review Groups",
        url: "/dashboard/review-groups",
        icon: Users,
    },
    {
        title: "Users",
        url: "/dashboard/users",
        icon: UserRoundPen,
    },
    {
        title: "Assessments",
        url: "/dashboard/assessments",
        icon: BookOpenText,
    },
    {
        title: "Other",
        url: "/dashboard/other",
        icon: Settings,
    },
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [userData, setUserData] = useState({ name: "", email: "", avatar: "" });

    useEffect(() => {
        const fetchData = async () => {
            const res = await protectedFetch("/user", "GET");
            setUserData({
                name: res.data.firstName + " " + res.data.lastName,
                email: res.data.email,
                avatar: "/avatars/shadcn.jpg",
            });
        };
        fetchData();
    }, []);

    console.log(userData);
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">AMT</span>
                                    <span className="truncate text-xs">Aston Moderation Tracker</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <Button variant="outline" onClick={() => toast.error("Toast title", { icon: <Bell className="size-5 mx-2" />, description: "toast description", descriptionClassName: cn("text-red-500") })}>
                Toast
            </Button>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    );
}
