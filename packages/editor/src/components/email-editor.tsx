// ─── EmailEditor ─────────────────────────────────────────────────────────────
// Main orchestrator component. Wraps all editor parts in EditorProvider.
// This is the primary entry point for users.

import React from "react";
import { EditorProvider } from "../engine/editor-store";
import { DragDropProvider } from "./dnd/drag-drop-provider";
import { EditorToolbar } from "./editor-toolbar";
import { EditorSidebar } from "./editor-sidebar";
import { EditorCanvas } from "./editor-canvas";
import { PropertiesPanel } from "./properties-panel";
import type { EmailDocument, EditorConfig } from "../types";

export interface EmailEditorProps {
    /** Initial document to edit */
    initialDocument?: EmailDocument;
    /** Callback fired whenever the document changes */
    onChange?: (document: EmailDocument) => void;
    /** Editor configuration */
    config?: EditorConfig;
    /** Custom class name */
    className?: string;
    /** Custom style */
    style?: React.CSSProperties;

    // ─── Slot overrides ─────────────────────────────────────────
    /** Replace the toolbar entirely */
    toolbar?: React.ReactNode | false;
    /** Replace the sidebar entirely */
    sidebar?: React.ReactNode | false;
    /** Replace the properties panel entirely */
    propertiesPanel?: React.ReactNode | false;
    /** Replace the canvas entirely */
    canvas?: React.ReactNode;
    /** Extra toolbar actions */
    toolbarActions?: React.ReactNode;
    /** Custom component overrides */
    components?: {
        ExportJSONButton?: React.ComponentType<{ onClick: () => void }>;
        ExportHTMLButton?: React.ComponentType<{ onClick: () => void; loading?: boolean }>;
    };
    /** Called when HTML is exported */
    onExportHTML?: (html: string) => void;
    /** Called when JSON is exported */
    onExportJSON?: (json: string) => void;
}

export function EmailEditor({
    initialDocument,
    onChange,
    config = {},
    className,
    style,
    toolbar,
    sidebar,
    propertiesPanel,
    canvas,
    toolbarActions,
    components,
    onExportHTML,
    onExportJSON,
}: EmailEditorProps) {
    const {
        showSidebar = true,
        showToolbar = true,
        showProperties = true,
        showExportJSON = true,
        showExportHTML = true,
        theme = "light",
        availableModes,
        registry,
    } = config;

    return React.createElement(
        EditorProvider,
        { initialDocument, onChange },
        React.createElement(
            DragDropProvider,
            null,
            React.createElement(
                "div",
                {
                    className: `open-email-editor ${className ?? ""}`,
                    "data-theme": theme,
                    style,
                },

                // Toolbar
                showToolbar &&
                toolbar !== false &&
                (toolbar ??
                    React.createElement(EditorToolbar, {
                        modes: availableModes,
                        actions: toolbarActions,
                        showExportJSON,
                        showExportHTML,
                        components,
                        onExportHTML,
                        onExportJSON,
                    })),

                // Body (sidebar + canvas + properties)
                React.createElement(
                    "div",
                    { className: "oe-editor-body" },

                    // Sidebar (Draggables)
                    showSidebar &&
                    sidebar !== false &&
                    (sidebar ?? React.createElement(EditorSidebar, { registry })),

                    // Canvas (Droppables/Sortables)
                    canvas ?? React.createElement(EditorCanvas, null),

                    // Properties Panel
                    showProperties &&
                    propertiesPanel !== false &&
                    (propertiesPanel ??
                        React.createElement(PropertiesPanel, { registry }))
                )
            )
        )
    );
}
