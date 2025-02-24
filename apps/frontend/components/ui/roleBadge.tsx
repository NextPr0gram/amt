import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// custom badge for Roles only, built on top of badge
// add extra prop to select color

const RoleBadgeVariants = cva("inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300", {
    variants: {
        variant: {
            default: "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80",
            secondary: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
            outline: "text-zinc-950 dark:text-zinc-50",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface RoleBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof RoleBadgeVariants> {
    role: "Assessment Lead" | "Module Lead" | "Module Tutor";
}

function RoleBadge({ className, variant, ...props }: RoleBadgeProps) {
    let color = "";
    if (props.role === "Assessment Lead") {
        color = "bg-red-300 text-red-950 dark:bg-red-500 dark:text-red-50";
    } else if (props.role === "Module Lead") {
        color = "bg-blue-300 text-blue-950 dark:bg-blue-500 dark:text-blue-50";
    } else if (props.role === "Module Tutor") {
        color = "bg-green-300 text-green-950 dark:bg-green-500 dark:text-green-50";
    }
    return (
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300 ${color} ${className}`} {...props}>
            {props.role}
        </div>
    );
}

export { RoleBadge, RoleBadgeVariants };
