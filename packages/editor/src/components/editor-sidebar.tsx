// ─── Editor Sidebar ──────────────────────────────────────────────────────────
// Left sidebar with "Components" and "Layers" tabs.

import React, { useState, useCallback } from "react";
import { useEditor } from "../engine/editor-store";
import { defaultRegistry, getComponentsByCategory } from "../registry/component-registry";
import { createNode } from "../engine/operations";
import { ComponentCard } from "./component-card";
import { LayerTree } from "./layer-tree";
import { Icons } from "./icons";
import type { ComponentDefinition, ComponentRegistry } from "../types";

export interface EditorSidebarProps {
    className?: string;
    /** Custom component registry */
    registry?: ComponentRegistry;
    /** Initial active tab */
    defaultTab?: "components" | "layers";
}

export function EditorSidebar({
    className,
    registry,
    defaultTab = "components",
}: EditorSidebarProps) {
    const [activeTab, setActiveTab] = useState<"components" | "layers">(defaultTab);
    const { selectedNodeId, document, addNode } = useEditor();
    const reg = registry ?? defaultRegistry;
    const grouped = getComponentsByCategory(reg);

    const handleAddComponent = useCallback(
        (def: ComponentDefinition) => {
            const newNode = createNode(
                def.type,
                { ...def.defaultProps },
                def.acceptsChildren ? [] : undefined
            );

            // Add to selected node if it accepts children, otherwise add to root
            const parentId = selectedNodeId ?? document.body.id;
            addNode(parentId, newNode);
        },
        [selectedNodeId, document.body.id, addNode]
    );

    const categoryLabels: Record<string, string> = {
        layout: "Layout",
        content: "Content",
        utility: "Utility",
    };

    return React.createElement(
        "div",
        { className: `oe-sidebar ${className ?? ""}` },

        // Tab buttons
        React.createElement(
            "div",
            { className: "oe-sidebar-tabs" },
            React.createElement(
                "button",
                {
                    className: "oe-sidebar-tab",
                    "data-active": activeTab === "components" ? "true" : "false",
                    onClick: () => setActiveTab("components"),
                },
                React.createElement(Icons.plus, { size: 14 }),
                " Components"
            ),
            React.createElement(
                "button",
                {
                    className: "oe-sidebar-tab",
                    "data-active": activeTab === "layers" ? "true" : "false",
                    onClick: () => setActiveTab("layers"),
                },
                React.createElement(Icons.layers, { size: 14 }),
                " Layers"
            )
        ),

        // Tab content
        React.createElement(
            "div",
            { className: "oe-sidebar-content" },
            activeTab === "components"
                ? // Components palette
                Object.entries(grouped).map(([category, defs]) =>
                    React.createElement(
                        "div",
                        { key: category, className: "oe-component-category" },
                        React.createElement(
                            "div",
                            { className: "oe-component-category-title" },
                            categoryLabels[category] ?? category
                        ),
                        React.createElement(
                            "div",
                            { className: "oe-component-grid" },
                            defs.map((def) =>
                                React.createElement(ComponentCard, {
                                    key: def.type,
                                    definition: def,
                                    onClick: handleAddComponent,
                                })
                            )
                        )
                    )
                )
                : // Layer tree
                React.createElement(LayerTree, null)
        )
    );
}
