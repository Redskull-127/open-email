// ─── Component Card ──────────────────────────────────────────────────────────
// Clickable card in the sidebar component palette.

import React from "react";
import type { ComponentDefinition } from "../types";
import { getIcon } from "./icons";

export interface ComponentCardProps {
    definition: ComponentDefinition;
    onClick: (definition: ComponentDefinition) => void;
    className?: string;
}

export function ComponentCard({ definition, onClick, className }: ComponentCardProps) {
    const Icon = getIcon(definition.icon);

    return React.createElement(
        "button",
        {
            className: `oe-component-card ${className ?? ""}`,
            onClick: () => onClick(definition),
            title: definition.description,
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
