"use client";
import { CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("", {
    variants: {
        variant: {
            success: "bg-green-50 text-green-700 border-green-200",
            error: "bg-red-50 text-red-700 border-red-200",
        },
    },
    defaultVariants: {
        variant: "success",
    },
});

interface ModalAlertProps {
    type: "success" | "error";
    message: string;
}

const ModalAlert = ({ type, message }: ModalAlertProps) => {
    const Icon = type === "success" ? CheckCircle2 : XCircle;
    const iconColor = type === "success" ? "#15803d" : "#b91c1c";

    return (
        <Alert className={alertVariants({ variant: type })}>
            <Icon color={iconColor} className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
};

export default ModalAlert;
