// ─── Layer Tree ──────────────────────────────────────────────────────────────
// Recursive tree view of the document structure.

import React, { useState, useCallback } from "react";
import type { EmailNode, NodeId } from "../types";
import { useEditor } from "../engine/editor-store";
import { Icons, getIcon } from "./icons";
import { defaultRegistry } from "../registry/component-registry";

interface LayerNodeProps {
    node: EmailNode;
    depth?: number;
}

function LayerNode({ node, depth = 0 }: LayerNodeProps): React.ReactElement {
    const { selectedNodeId, selectNode } = useEditor();
    const [expanded, setExpanded] = useState(true);
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const def = defaultRegistry.get(node.type);
    const Icon = getIcon(def?.icon ?? "box");

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            selectNode(node.id);
        },
        [node.id, selectNode]
    );

    const toggleExpand = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
        },
        []
    );

    // Get a preview label for the node
    let label = def?.label ?? node.type;
    const content = (node.props.content ?? node.props.text ?? "") as string;
    if (content) {
        label += `: ${content.slice(0, 20)}${content.length > 20 ? "…" : ""}`;
    }

    return React.createElement(
        "li",
        { className: "oe-layer-item" },
        React.createElement(
            "div",
            {
                className: "oe-layer-item-content",
                "data-selected": isSelected ? "true" : "false",
                onClick: handleClick,
                style: { paddingLeft: `${depth * 16 + 8}px` },
            },
            hasChildren
                ? React.createElement(
                    "span",
                    {
                        className: "oe-layer-item-icon",
                        onClick: toggleExpand,
                        style: { cursor: "pointer" },
                    },
                    expanded
                        ? React.createElement(Icons.chevronDown, { size: 12 })
                        : React.createElement(Icons.chevronRight, { size: 12 })
                )
                : React.createElement("span", {
                    className: "oe-layer-item-icon",
                    style: { width: 12 },
                }),
            React.createElement(Icon, { size: 12 }),
            React.createElement("span", { className: "oe-layer-item-label" }, label)
        ),
        hasChildren && expanded
            ? React.createElement(
                "ul",
                { className: "oe-layer-children" },
                node.children!.map((child) =>
                    React.createElement(LayerNode, {
                        key: child.id,
                        node: child,
                        depth: depth + 1,
                    })
                )
            )
            : null
    );
}

export interface LayerTreeProps {
    className?: string;
}

export function LayerTree({ className }: LayerTreeProps) {
    const { document } = useEditor();

    return React.createElement(
        "ul",
        { className: `oe-layer-tree ${className ?? ""}` },
        React.createElement(LayerNode, { node: document.body })
    );
}
