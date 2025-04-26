"use client";

import * as React from "react";
import { Command, Settings, Component, Users, UserRoundPen, BookOpenText, LayoutDashboard, Calendar, Bell, Folder } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { protectedFetch } from "@/utils/protected-fetch";
import { useEffect, useState } from "react";
import SidebarCard from "./sidebar-card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDemoDate } from "./contexts/demo-date-context";

// Menu items with role-based visibility.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        allowedRoles: [1, 2, 3], // Assessment Lead, Module Lead, Module Tutor
    },
    {
        title: "Review Groups",
        url: "/review-groups",
        icon: Users,
        allowedRoles: [1], // Assessment Lead, Module Tutor
    },
    {
        title: "Users",
        url: "/users",
        icon: UserRoundPen,
        allowedRoles: [1], // Assessment Lead
    },
    {
        title: "Modules & Assessments",
        url: "/modules-and-assessments",
        icon: Component,
        allowedRoles: [1], // Assessment Lead
    },
    {
        title: "Deadlines",
        url: "/deadlines",
        icon: Calendar,
        allowedRoles: [1], // Assessment Lead
    },
    {
        title: "External Reviewers Folders",
        url: "/er-folders",
        icon: Folder,
        allowedRoles: [1], // Assessment Lead
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [userData, setUserData] = useState({ name: "", email: "", avatar: "" });
    const [isBoxConnected, setIsBoxConnected] = useState(true);
    const [userRoles, setUserRoles] = useState<number[]>([]);
    const { date, fetchDate } = useDemoDate();

    useEffect(() => {
        const fetchData = async () => {
            // Fetch user data
            const userRes = await protectedFetch("/user", "GET");
            setUserData({
                name: userRes.data.firstName + " " + userRes.data.lastName,
                email: userRes.data.email,
                avatar: "/avatars/shadcn.jpg",
            });

            // Fetch user roles
            const rolesRes = await protectedFetch("/user/user-roles", "GET");
            const roles = rolesRes.data.map((roleObj: { role: { id: number } }) => roleObj.role.id);
            setUserRoles(roles);
        };

        const fetchIsBoxConnected = async () => {
            const res = await protectedFetch("/user/is-box-connected", "GET");
            if (res.status !== 200) {
                setIsBoxConnected(false);
            }
        };
        fetchData();
        fetchIsBoxConnected();
    }, []);

    // Filter menu items based on user roles
    const filteredItems = items.filter((item) => item.allowedRoles.some((role) => userRoles.includes(role)));

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
                    <SidebarGroupLabel>Pages</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item) => (
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
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupLabel>Demo controls</SidebarGroupLabel>
                    <div className="space-y-2 ">
                        <div className="flex space-x-2">
                            <Button
                                onClick={async () => {
                                    await protectedFetch("/demo/add-1-day", "POST");
                                    fetchDate();
                                }}
                                className="flex-1"
                                variant="outline"
                            >
                                +1
                            </Button>
                            <Button
                                onClick={async () => {
                                    await protectedFetch("/demo/add-5-days", "POST");
                                    fetchDate();
                                }}
                                className="flex-1"
                                variant="outline"
                            >
                                +5
                            </Button>
                            <Button
                                onClick={async () => {
                                    await protectedFetch("/demo/add-10-days", "POST");
                                    fetchDate();
                                }}
                                className="flex-1"
                                variant="outline"
                            >
                                +10
                            </Button>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                onClick={async () => {
                                    await protectedFetch("/demo/subtract-1-day", "POST");
                                    fetchDate();
                                }}
                                className="flex-1"
                                variant="outline"
                            >
                                -1
                            </Button>
                            <Button
                                onClick={async () => {
                                    await protectedFetch("/demo/subtract-5-days", "POST");
                                    fetchDate();
                                }}
                                className="flex-1"
                                variant="outline"
                            >
                                -5
                            </Button>
                            <Button
                                onClick={async () => {
                                    await protectedFetch("/demo/subtract-10-days", "POST");
                                    fetchDate();
                                }}
                                className="flex-1"
                                variant="outline"
                            >
                                -10
                            </Button>
                        </div>
                        <Button className="w-full" variant="outline" onClick={() => protectedFetch("/demo/unfinalize-review-groups", "POST")}>
                            Unfinalize RGs
                        </Button>
                        <Button className="w-full" variant="outline" onClick={() => toast.error("Toast title", { icon: <Bell className="size-5 mx-2" />, description: "toast description", descriptionClassName: cn("text-red-500") })}>
                            Toast
                        </Button>
                        <div className="flex space-x-2">
                            <Button onClick={() => protectedFetch("/demo/prev-phase", "POST")} className="flex-1" variant="outline">
                                Prv Phase
                            </Button>
                            <Button onClick={() => protectedFetch("/demo/next-phase", "POST")} className="flex-1" variant="outline">
                                Nxt Phase
                            </Button>
                        </div>
                    </div>
                </SidebarGroup>
                {!isBoxConnected && <SidebarCard />}
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    );
}
