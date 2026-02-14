// ─── Drag & Drop Provider ────────────────────────────────────────────────────
// Unified DnD context using @dnd-kit. Wraps the entire editor body so that
// sidebar → canvas, canvas → canvas and layer → layer drags all share
// the same DndContext.

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    pointerWithin,
    rectIntersection,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
    type CollisionDetection,
} from "@dnd-kit/core";
import { useEditor } from "../../engine/editor-store";
import { createNode } from "../../engine/operations";
import { defaultRegistry } from "../../registry/component-registry";
import type { EmailNodeType } from "../../types";

// ─── Drag Data Types ─────────────────────────────────────────────────────────

/** Data attached to a sidebar draggable */
export interface SidebarDragData {
    origin: "sidebar";
    componentType: string;
    label: string;
}

/** Data attached to a canvas/layer sortable */
export interface NodeDragData {
    origin: "canvas" | "layers";
    nodeId: string;
    parentId: string;
    index: number;
    label: string;
}

export type DragData = SidebarDragData | NodeDragData;

/** Data attached to a droppable zone */
export interface DropZoneData {
    parentId: string;
    index: number;
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface DragDropContextValue {
    activeId: string | null;
    activeData: DragData | null;
    overId: string | null;
}

const DragDropCtx = createContext<DragDropContextValue>({
    activeId: null,
    activeData: null,
    overId: null,
});

export function useDragDrop() {
    return useContext(DragDropCtx);
}

// ─── Collision detection ─────────────────────────────────────────────────────
// Use pointerWithin for precision, fall back to rectIntersection.

const collisionDetection: CollisionDetection = (args) => {
    const pointerResult = pointerWithin(args);
    if (pointerResult.length > 0) return pointerResult;
    return rectIntersection(args);
};

// ─── Provider ────────────────────────────────────────────────────────────────

interface DragDropProviderProps {
    children: ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
    const { addNode, moveNode } = useEditor();

    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeData, setActiveData] = useState<DragData | null>(null);
    const [overId, setOverId] = useState<string | null>(null);

    // Sensors — distance constraint lets normal clicks go through
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
    );

    // ── handlers ────────────────────────────────────────────────────

    const handleDragStart = useCallback((e: DragStartEvent) => {
        const data = e.active.data.current as DragData | undefined;
        setActiveId(String(e.active.id));
        setActiveData(data ?? null);
    }, []);

    const handleDragOver = useCallback((e: DragOverEvent) => {
        setOverId(e.over ? String(e.over.id) : null);
    }, []);

    const handleDragEnd = useCallback(
        (e: DragEndEvent) => {
            const { active, over } = e;
            const data = active.data.current as DragData | undefined;
            const dropData = over?.data.current as DropZoneData | undefined;

            setActiveId(null);
            setActiveData(null);
            setOverId(null);

            if (!over || !data || !dropData) return;

            // ── Sidebar → Canvas: create new node ──────────────────────
            if (data.origin === "sidebar") {
                const def = defaultRegistry.get(data.componentType as EmailNodeType);
                if (!def) return;
                const newNode = createNode(
                    def.type,
                    { ...def.defaultProps },
                    def.acceptsChildren ? [] : undefined
                );
                addNode(dropData.parentId, newNode, dropData.index);
                return;
            }

            // ── Canvas/Layer reorder: move existing node ───────────────
            if (data.origin === "canvas" || data.origin === "layers") {
                const fromParent = data.parentId;
                const fromIndex = data.index;
                const toParent = dropData.parentId;
                const toIndex = dropData.index;

                // Skip if dropped in the exact same position
                if (fromParent === toParent && fromIndex === toIndex) return;

                // Adjust target index when moving within the same parent
                // If moving downward, the removal shifts indexes down by 1
                let adjustedIndex = toIndex;
                if (fromParent === toParent && fromIndex < toIndex) {
                    adjustedIndex = toIndex - 1;
                }

                moveNode(data.nodeId, toParent, adjustedIndex);
            }
        },
        [addNode, moveNode]
    );

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
        setActiveData(null);
        setOverId(null);
    }, []);

    // ── value ───────────────────────────────────────────────────────

    const ctxValue = useMemo(
        () => ({ activeId, activeData, overId }),
        [activeId, activeData, overId]
    );

    const dndId = React.useId();

    return React.createElement(
        DndContext,
        {
            id: dndId,
            sensors,
            collisionDetection,
            onDragStart: handleDragStart,
            onDragOver: handleDragOver,
            onDragEnd: handleDragEnd,
            onDragCancel: handleDragCancel,
        },
        React.createElement(
            DragDropCtx.Provider,
            { value: ctxValue },
            children
        ),
        // Drag overlay — generic floating ghost
        React.createElement(
            DragOverlay,
            { dropAnimation: null },
            activeData
                ? React.createElement(
                    "div",
                    { className: "oe-drag-overlay" },
                    activeData.label
                )
                : null
        )
    );
}
