"use client";
import DemoControl from "./demo-control";
import { FloatingPanel } from "./floating-panel";

export function DraggableDemoControl() {
    return (
        <FloatingPanel title="Demo Controls" defaultPosition={{ x: 10, y: window.innerHeight - 560 }}>
            <DemoControl />
        </FloatingPanel>
    );
}
