import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export function DateStage() {
    const date = new Date().toDateString();
    return (
        <>
            <div className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    {date}
                </div>
            </div>
            <div className="px-4">
                <Separator />
            </div>
        </>
    );
}
