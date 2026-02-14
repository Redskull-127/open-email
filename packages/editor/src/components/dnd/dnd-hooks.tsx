// ─── DnD Hooks ───────────────────────────────────────────────────────────────
// Reusable hooks for making items draggable and zones droppable.
// Shared between Canvas and Layer Tree — keeps logic DRY.

import { useMemo } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { SidebarDragData, NodeDragData, DropZoneData } from "./drag-drop-provider";

// ─── Sidebar Draggable ───────────────────────────────────────────────────────

/** Makes a sidebar component card draggable. */
export function useSidebarDraggable(componentType: string, label: string) {
    const data: SidebarDragData = useMemo(
        () => ({ origin: "sidebar" as const, componentType, label }),
        [componentType, label]
    );

    return useDraggable({
        id: `sidebar-${componentType}`,
        data,
    });
}

// ─── Node Draggable ──────────────────────────────────────────────────────────

/** Makes an existing node draggable (for canvas and layer tree). */
export function useNodeDraggable(
    nodeId: string,
    parentId: string,
    index: number,
    label: string,
    origin: "canvas" | "layers"
) {
    const data: NodeDragData = useMemo(
        () => ({ origin, nodeId, parentId, index, label }),
        [origin, nodeId, parentId, index, label]
    );

    return useDraggable({
        id: `${origin}-${nodeId}`,
        data,
    });
}

// ─── Drop Zone ───────────────────────────────────────────────────────────────

/**
 * Creates a drop zone indicator between sibling nodes.
 * `parentId` = the parent container that will receive the dropped child.
 * `index`    = the insertion index within parent.children.
 */
export function useDropZone(parentId: string, index: number) {
    const data: DropZoneData = useMemo(
        () => ({ parentId, index }),
        [parentId, index]
    );

    return useDroppable({
        id: `dropzone-${parentId}-${index}`,
        data,
    });
}

/**
 * Creates a droppable area for an empty container.
 * Inserts at index 0.
 */
export function useContainerDropZone(containerId: string) {
    const data: DropZoneData = useMemo(
        () => ({ parentId: containerId, index: 0 }),
        [containerId]
    );

    return useDroppable({
        id: `container-${containerId}`,
        data,
    });
}

/**
 * Makes a canvas node droppable.
 * When something is dropped ON a node:
 * - If it accepts children → insert at index 0 (inside)
 * - If it does not → insert after this node (parentId, index+1)
 */
export function useNodeDroppable(
    nodeId: string,
    parentId: string,
    index: number,
    acceptsChildren: boolean
) {
    const data: DropZoneData = useMemo(
        () => acceptsChildren
            ? { parentId: nodeId, index: 0 }     // drop into this container
            : { parentId, index: index + 1 },     // drop after this node
        [acceptsChildren, nodeId, parentId, index]
    );

    return useDroppable({
        id: `node-drop-${nodeId}`,
        data,
    });
}
