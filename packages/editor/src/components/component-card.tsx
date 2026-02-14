// ─── Component Card ──────────────────────────────────────────────────────────
// Clickable + draggable card in the sidebar component palette.

import React from "react";
import type { ComponentDefinition } from "../types";
import { getIcon } from "./icons";
import { useSidebarDraggable } from "./dnd";

export interface ComponentCardProps {
    definition: ComponentDefinition;
    onClick: (definition: ComponentDefinition) => void;
    className?: string;
}

export function ComponentCard({ definition, onClick, className }: ComponentCardProps) {
    const Icon = getIcon(definition.icon);
    const { attributes, listeners, setNodeRef, isDragging } = useSidebarDraggable(
        definition.type,
        definition.label
    );

    return React.createElement(
        "button",
        {
            ref: setNodeRef,
            className: `oe-component-card ${isDragging ? "oe-dragging" : ""} ${className ?? ""}`,
            onClick: () => onClick(definition),
            title: definition.description,
            ...listeners,
            ...attributes,
        },
        React.createElement(
            "span",
            { className: "oe-component-card-icon" },
            React.createElement(Icon, { size: 18 })
        ),
        React.createElement(
            "span",
            { className: "oe-component-card-label" },
            definition.label
        )
    );
}
