import React from "react";
import { EditorProvider } from "../engine/editor-store";
import { DragDropProvider } from "./dnd/drag-drop-provider";
import { EditorToolbar } from "./editor-toolbar";
import { EditorSidebar } from "./editor-sidebar";
import { EditorCanvas } from "./editor-canvas";
import { PropertiesPanel } from "./properties-panel/index";
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
    ExportHTMLButton?: React.ComponentType<{
      onClick: () => void;
      loading?: boolean;
    }>;
  };
    /** Variable values for {{variableName}} interpolation when exporting HTML or in preview */
    variableData?: Record<string, string>;
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
    variableData,
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

        showToolbar &&
          toolbar !== false &&
                (toolbar ??
                    React.createElement(EditorToolbar, {
                        modes: availableModes,
                        actions: toolbarActions,
                        variableData,
                        showExportJSON,
                        showExportHTML,
                        components,
                        onExportHTML,
                        onExportJSON,
                    })),

        React.createElement(
          "div",
          { className: "oe-editor-body" },

          showSidebar &&
            sidebar !== false &&
            (sidebar ?? React.createElement(EditorSidebar, { registry })),

          canvas ?? React.createElement(EditorCanvas, { variableData }),
          showProperties &&
            propertiesPanel !== false &&
            (propertiesPanel ?? React.createElement(PropertiesPanel, { registry })),
        ),
      ),
    ),
  );
}
