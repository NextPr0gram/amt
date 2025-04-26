"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Minus, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingPanelProps {
    title?: string;
    children: React.ReactNode;
    defaultPosition?: { x: number; y: number };
    className?: string;
}

export function FloatingPanel({ title = "Controls", children, defaultPosition = { x: 20, y: 20 }, className }: FloatingPanelProps) {
    const [position, setPosition] = useState(defaultPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isDragging) return;

        let animationFrameId: number;

        const handleMouseMove = (e: MouseEvent) => {
            cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                if (!panelRef.current) return;

                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                const maxX = window.innerWidth - panelRef.current.offsetWidth;
                const maxY = window.innerHeight - panelRef.current.offsetHeight;

                panelRef.current.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
                panelRef.current.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;

                setPosition({
                    x: Math.max(0, Math.min(newX, maxX)),
                    y: Math.max(0, Math.min(newY, maxY)),
                });
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);

            if (panelRef.current) {
                const rect = panelRef.current.getBoundingClientRect();
                setPosition({
                    x: rect.left,
                    y: rect.top,
                });
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDragging, dragOffset]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (panelRef.current) {
            const rect = panelRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setIsDragging(true);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div
            ref={panelRef}
            className={cn("fixed shadow-lg rounded-lg overflow-hidden transition-all duration-200", "border border-border bg-white text-card-foreground", isMinimized ? "w-auto h-auto" : "w-auto", className)}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 9999,
            }}
        >
            <div className="bg-muted px-4 py-2 cursor-move flex items-center justify-between" onMouseDown={handleMouseDown}>
                <span className="font-medium text-sm">{title}</span>
                <button onClick={toggleMinimize} className="p-1 hover:bg-muted-foreground/10 rounded">
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </button>
            </div>
            <div className={cn("transition-all", isMinimized ? "h-0 opacity-0 invisible" : "opacity-100 visible")}>{children}</div>
        </div>
    );
}
