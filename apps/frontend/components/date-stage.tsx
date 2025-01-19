import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "./ui/sidebar";

export function DateStage() {
    const date = new Date().toDateString();
    return (
        <>
            <div className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    {date}
                </div>
            </div>
            <div className="px-4">
                <Separator />
            </div>
        </>
    );
}
