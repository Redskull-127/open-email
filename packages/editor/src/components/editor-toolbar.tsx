import React, { useCallback, useState, useMemo } from "react";
import { useEditor } from "../engine/editor-store";
import { exportToJSON } from "../renderer/json-renderer";
import { renderToHTML } from "../renderer/html-renderer";
import { Icons } from "./icons";
import type { EditorMode } from "../types";

export interface EditorToolbarProps {
  className?: string;
  /** Override available modes */
  modes?: EditorMode[];
  /** Custom actions rendered on the right side (before export buttons) */
  actions?: React.ReactNode;
  /** Variable values for {{variableName}} interpolation when exporting HTML */
  variableData?: Record<string, string>;
  /** Called when HTML is exported */
  onExportHTML?: (html: string) => void;
  /** Called when JSON is exported */
  onExportJSON?: (json: string) => void;
  /** Whether to show the JSON export button (default: true) */
  showExportJSON?: boolean;
  /** Whether to show the HTML export button (default: true) */
  showExportHTML?: boolean;
  /** Custom component overrides */
  components?: {
    ExportJSONButton?: React.ComponentType<{ onClick: () => void }>;
    ExportHTMLButton?: React.ComponentType<{
      onClick: () => void;
      loading?: boolean;
    }>;
  };
}

export function EditorToolbar({
  className,
  modes = ["visual", "code", "preview"],
  actions,
  variableData,
  onExportHTML,
  onExportJSON,
  showExportJSON = true,
  showExportHTML = true,
  components = {},
}: EditorToolbarProps) {
  const { mode, setMode, document } = useEditor();
  const [exporting, setExporting] = useState(false);

  const modeLabels = useMemo<Record<EditorMode, { label: string; Icon: React.ComponentType<any> }>>(
    () => ({
      visual: { label: "Visual", Icon: Icons.eye },
      code: { label: "Code", Icon: Icons.code },
      preview: { label: "Preview", Icon: Icons.monitor },
    }),
    []
  );

  const handleExportHTML = useCallback(async () => {
    setExporting(true);
    try {
      const html = await renderToHTML(document, variableData);
      if (onExportHTML) {
        onExportHTML(html);
      } else {
        await navigator.clipboard.writeText(html);
      }
    } catch (err) {
      console.error("Export HTML failed:", err);
    } finally {
      setExporting(false);
    }
  }, [document, variableData, onExportHTML]);

  const handleExportJSON = useCallback(() => {
    const json = exportToJSON(document);
    if (onExportJSON) {
      onExportJSON(json);
    } else {
      navigator.clipboard.writeText(json);
    }
  }, [document, onExportJSON]);

  const { ExportJSONButton, ExportHTMLButton } = components;

  return React.createElement(
    "div",
    { className: `oe-toolbar ${className ?? ""}` },

    React.createElement(
      "div",
      { className: "oe-toolbar-section" },
      React.createElement(
        "div",
        { className: "oe-mode-switcher" },
        ...modes.map((m) => {
          const { label, Icon } = modeLabels[m];
          return React.createElement(
            "button",
            {
              key: m,
              className: "oe-mode-btn",
              "data-active": mode === m ? "true" : "false",
              onClick: () => setMode(m),
              title: `${label} mode`,
            },
            React.createElement(Icon, { size: 14 }),
            label,
          );
        }),
      ),
    ),

    React.createElement(
      "div",
      { className: "oe-toolbar-section" },
      actions,
      showExportJSON &&
        (ExportJSONButton
          ? React.createElement(ExportJSONButton, { onClick: handleExportJSON })
          : React.createElement(
              "button",
              {
                className: "oe-btn",
                onClick: handleExportJSON,
                title: "Export JSON to clipboard",
              },
              React.createElement(Icons.copy, { size: 14 }),
              "JSON",
            )),
      showExportHTML &&
        (ExportHTMLButton
          ? React.createElement(ExportHTMLButton, {
              onClick: handleExportHTML,
              loading: exporting,
            })
          : React.createElement(
              "button",
              {
                className: "oe-btn oe-btn-primary",
                onClick: handleExportHTML,
                disabled: exporting,
                title: "Export HTML to clipboard",
              },
              React.createElement(Icons.download, { size: 14 }),
              exporting ? "Exporting…" : "Export HTML",
            )),
    ),
  );
}
