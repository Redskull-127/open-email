// ─── Layer Tree ──────────────────────────────────────────────────────────────
// Recursive tree view of the document structure with drag-and-drop reordering.

import React, { useState, useCallback } from "react";
import type { EmailNode } from "../types";
import { useEditor } from "../engine/editor-store";
import { Icons, getIcon } from "./icons";
import { defaultRegistry } from "../registry/component-registry";
import { useNodeDraggable, useDropZone } from "./dnd";

// ─── Drop Indicator (Layer version) ──────────────────────────────────────────

interface LayerDropIndicatorProps {
    parentId: string;
    index: number;
    depth: number;
}

function LayerDropIndicator({ parentId, index, depth }: LayerDropIndicatorProps) {
    const { setNodeRef, isOver } = useDropZone(parentId, index);

    return React.createElement("li", {
        ref: setNodeRef,
        className: `oe-layer-drop-indicator ${isOver ? "oe-layer-drop-indicator-active" : ""}`,
        style: { paddingLeft: `${depth * 16 + 8}px` },
    });
}

// ─── Layer Node ──────────────────────────────────────────────────────────────

interface LayerNodeProps {
    node: EmailNode;
    parentId: string;
    index: number;
    depth?: number;
}

function LayerNode({ node, parentId, index, depth = 0 }: LayerNodeProps): React.ReactElement {
    const { selectedNodeId, selectNode } = useEditor();
    const [expanded, setExpanded] = useState(true);
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const def = defaultRegistry.get(node.type);
    const Icon = getIcon(def?.icon ?? "box");
    const label = def?.label ?? node.type;

    // Draggable
    const {
        attributes,
        listeners,
        setNodeRef: setDragRef,
        isDragging,
    } = useNodeDraggable(node.id, parentId, index, label, "layers");

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
    let displayLabel = label;
    const content = (node.props.content ?? node.props.text ?? "") as string;
    if (content) {
        displayLabel += `: ${content.slice(0, 20)}${content.length > 20 ? "…" : ""}`;
    }

    const childElements: React.ReactNode[] = [];
    if (hasChildren && expanded) {
        // Drop indicator before first child
        childElements.push(
            React.createElement(LayerDropIndicator, {
                key: `ldrop-${node.id}-0`,
                parentId: node.id,
                index: 0,
                depth: depth + 1,
            })
        );

        node.children!.forEach((child, i) => {
            childElements.push(
                React.createElement(LayerNode, {
                    key: child.id,
                    node: child,
                    parentId: node.id,
                    index: i,
                    depth: depth + 1,
                })
            );
            // Drop indicator after each child
            childElements.push(
                React.createElement(LayerDropIndicator, {
                    key: `ldrop-${node.id}-${i + 1}`,
                    parentId: node.id,
                    index: i + 1,
                    depth: depth + 1,
                })
            );
        });
    }

    return React.createElement(
        "li",
        {
            ref: setDragRef,
            className: `oe-layer-item ${isDragging ? "oe-dragging" : ""}`,
            ...attributes,
        },
        React.createElement(
            "div",
            {
                className: "oe-layer-item-content",
                "data-selected": isSelected ? "true" : "false",
                onClick: handleClick,
                style: { paddingLeft: `${depth * 16 + 8}px` },
                ...listeners,
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
            React.createElement("span", { className: "oe-layer-item-label" }, displayLabel)
        ),
        childElements.length > 0
            ? React.createElement("ul", { className: "oe-layer-children" }, ...childElements)
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
        React.createElement(LayerNode, {
            node: document.body,
            parentId: "__root__",
            index: 0,
        })
    );
}
