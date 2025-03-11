import { Metadata } from "next";
import Image from "next/image";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUserRound } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import { Command } from "lucide-react";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Example dashboard app built using the components.",
};

export default function Page() {
    return (
        <>
            <div className="border-b">
                <div className="flex justify-between py-2 items-center px-4">
                    <Button
                        className="py-6 px-2 pr-4 bg-sidebar-primary-foreground text-sidebar-foreground peer/menu-button flex  items-center gap-2 overflow-hidden rounded-md text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        size="lg"
                        asChild
                    >
                        <Link href="/dashboard">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Command className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">AMT</span>
                                <span className="truncate text-xs">Aston Moderation Tracker</span>
                            </div>
                        </Link>
                    </Button>
                    <div className="ml-auto flex items-center space-x-4">
                        <NavUserRound user={{ name: "John Doe", email: "john@john.com", avatar: "CN" }} />
                    </div>
                </div>
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground">Manage your notifications.</p>
                </div>
            </div>
        </>
    );
}
