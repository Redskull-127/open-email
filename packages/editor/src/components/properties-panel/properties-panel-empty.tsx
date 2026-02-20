import React, { useCallback, useState } from "react";
import type { FontConfig } from "../../types";

export interface DocumentMeta {
  title: string;
  description?: string;
  previewText?: string;
  subject?: string;
  fonts?: FontConfig[];
  tailwind?: {
    enabled: boolean;
    config?: string;
  };
}

export interface PropertiesPanelEmptyProps {
  className?: string;
  meta?: DocumentMeta;
  onMetaChange?: (update: Partial<DocumentMeta>) => void;
}

const FORMAT_OPTIONS = [
  { label: "WOFF2", value: "woff2" },
  { label: "WOFF", value: "woff" },
  { label: "TTF", value: "ttf" },
  { label: "OTF", value: "otf" },
] as const;

const WEIGHT_OPTIONS = [
  { label: "100 — Thin", value: "100" },
  { label: "200 — Extra Light", value: "200" },
  { label: "300 — Light", value: "300" },
  { label: "400 — Regular", value: "400" },
  { label: "500 — Medium", value: "500" },
  { label: "600 — Semi Bold", value: "600" },
  { label: "700 — Bold", value: "700" },
  { label: "800 — Extra Bold", value: "800" },
  { label: "900 — Black", value: "900" },
];

interface FontCardProps {
  font: FontConfig;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onChange: (index: number, update: Partial<FontConfig>) => void;
  onRemove: (index: number) => void;
}

function FontCard({ font, index, expanded, onToggle, onChange, onRemove }: FontCardProps) {
  return React.createElement(
    "div",
    { className: "oe-font-card" },
    React.createElement(
      "div",
      { className: "oe-font-card-header", onClick: onToggle },
      React.createElement(
        "div",
        { className: "oe-font-card-name" },
        font.fontFamily || React.createElement("span", { className: "oe-font-card-placeholder" }, "Unnamed font"),
      ),
      React.createElement(
        "div",
        { className: "oe-font-card-actions" },
        React.createElement(
          "span",
          { className: `oe-font-card-chevron ${expanded ? "oe-font-card-chevron-open" : ""}` },
          "›",
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: "oe-font-card-remove",
            title: "Remove font",
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              onRemove(index);
            },
          },
          "×",
        ),
      ),
    ),
    expanded &&
      React.createElement(
        "div",
        { className: "oe-font-card-body" },
        React.createElement(
          "div",
          { className: "oe-field" },
          React.createElement("label", { className: "oe-field-label" }, "Font Family"),
          React.createElement("input", {
            type: "text",
            className: "oe-field-input",
            placeholder: "e.g. Roboto",
            value: font.fontFamily ?? "",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(index, { fontFamily: e.target.value }),
          }),
        ),
        React.createElement(
          "div",
          { className: "oe-field" },
          React.createElement("label", { className: "oe-field-label" }, "Fallback Font"),
          React.createElement("input", {
            type: "text",
            className: "oe-field-input",
            placeholder: "e.g. Arial, sans-serif",
            value: font.fallbackFontFamily ?? "",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(index, { fallbackFontFamily: e.target.value }),
          }),
        ),
        React.createElement(
          "div",
          { className: "oe-field" },
          React.createElement("label", { className: "oe-field-label" }, "Web Font URL"),
          React.createElement("input", {
            type: "url",
            className: "oe-field-input",
            placeholder: "https://fonts.gstatic.com/…",
            value: font.webFontUrl ?? "",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(index, { webFontUrl: e.target.value }),
          }),
        ),
        React.createElement(
          "div",
          { className: "oe-field-row" },
          React.createElement(
            "div",
            { className: "oe-field" },
            React.createElement("label", { className: "oe-field-label" }, "Format"),
            React.createElement(
              "select",
              {
                className: "oe-field-input oe-field-select",
                value: font.webFontFormat ?? "woff2",
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  onChange(index, { webFontFormat: e.target.value as FontConfig["webFontFormat"] }),
              },
              FORMAT_OPTIONS.map((o) =>
                React.createElement("option", { key: o.value, value: o.value }, o.label),
              ),
            ),
          ),
          React.createElement(
            "div",
            { className: "oe-field" },
            React.createElement("label", { className: "oe-field-label" }, "Weight"),
            React.createElement(
              "select",
              {
                className: "oe-field-input oe-field-select",
                value: String(font.fontWeight ?? "400"),
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                  onChange(index, { fontWeight: e.target.value }),
              },
              WEIGHT_OPTIONS.map((o) =>
                React.createElement("option", { key: o.value, value: o.value }, o.label),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          { className: "oe-field" },
          React.createElement("label", { className: "oe-field-label" }, "Style"),
          React.createElement(
            "select",
            {
              className: "oe-field-input oe-field-select",
              value: font.fontStyle ?? "normal",
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                onChange(index, { fontStyle: e.target.value as FontConfig["fontStyle"] }),
            },
            React.createElement("option", { value: "normal" }, "Normal"),
            React.createElement("option", { value: "italic" }, "Italic"),
            React.createElement("option", { value: "oblique" }, "Oblique"),
          ),
        ),
      ),
  );
}

export function PropertiesPanelEmpty({ className, meta, onMetaChange }: PropertiesPanelEmptyProps) {
  const [expandedFonts, setExpandedFonts] = useState<Set<number>>(new Set());

  const handleField = useCallback(
    (key: keyof Pick<DocumentMeta, "title" | "description" | "previewText" | "subject">) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onMetaChange?.({ [key]: e.target.value });
      },
    [onMetaChange],
  );

  const handleTailwindToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMetaChange?.({ tailwind: { ...(meta?.tailwind ?? {}), enabled: e.target.checked } });
    },
    [onMetaChange, meta?.tailwind],
  );

  const handleTailwindConfig = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onMetaChange?.({ tailwind: { enabled: meta?.tailwind?.enabled ?? true, config: e.target.value } });
    },
    [onMetaChange, meta?.tailwind],
  );

  const handleAddFont = useCallback(() => {
    const fonts = [...(meta?.fonts ?? []), { fontFamily: "", fallbackFontFamily: "sans-serif", webFontFormat: "woff2" as const, fontWeight: "400", fontStyle: "normal" as const }];
    onMetaChange?.({ fonts });
    setExpandedFonts((prev) => new Set([...prev, fonts.length - 1]));
  }, [meta?.fonts, onMetaChange]);

  const handleFontChange = useCallback(
    (index: number, update: Partial<FontConfig>) => {
      const fonts = (meta?.fonts ?? []).map((f, i) => (i === index ? { ...f, ...update } : f));
      onMetaChange?.({ fonts });
    },
    [meta?.fonts, onMetaChange],
  );

  const handleFontRemove = useCallback(
    (index: number) => {
      const fonts = (meta?.fonts ?? []).filter((_, i) => i !== index);
      onMetaChange?.({ fonts });
      setExpandedFonts((prev) => {
        const next = new Set<number>();
        prev.forEach((i) => { if (i < index) next.add(i); else if (i > index) next.add(i - 1); });
        return next;
      });
    },
    [meta?.fonts, onMetaChange],
  );

  const toggleFont = useCallback((index: number) => {
    setExpandedFonts((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const tailwindEnabled = meta?.tailwind?.enabled ?? true;
  const fonts = meta?.fonts ?? [];

  return React.createElement(
    "div",
    { className: `oe-properties ${className ?? ""}` },

    React.createElement(
      "div",
      { className: "oe-properties-group" },
      React.createElement("div", { className: "oe-properties-group-title" }, "Document"),
      React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement("label", { className: "oe-field-label" }, "Title"),
        React.createElement("input", {
          type: "text",
          className: "oe-field-input",
          placeholder: "My Email Template",
          value: meta?.title ?? "",
          onChange: handleField("title"),
        }),
      ),
      React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement("label", { className: "oe-field-label" }, "Subject Line"),
        React.createElement("input", {
          type: "text",
          className: "oe-field-input",
          placeholder: "Your email subject...",
          value: meta?.subject ?? "",
          onChange: handleField("subject"),
        }),
      ),
      React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement("label", { className: "oe-field-label" }, "Preview Text"),
        React.createElement("input", {
          type: "text",
          className: "oe-field-input",
          placeholder: "Short preview shown in inbox...",
          value: meta?.previewText ?? "",
          onChange: handleField("previewText"),
        }),
      ),
      React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement("label", { className: "oe-field-label" }, "Description"),
        React.createElement("textarea", {
          className: "oe-field-input oe-field-textarea",
          placeholder: "Internal notes...",
          rows: 2,
          value: meta?.description ?? "",
          onChange: handleField("description"),
        }),
      ),
    ),

    React.createElement(
      "div",
      { className: "oe-properties-group" },
      React.createElement(
        "div",
        { className: "oe-properties-group-header" },
        React.createElement("div", { className: "oe-properties-group-title" }, "Web Fonts"),
        React.createElement(
          "button",
          { type: "button", className: "oe-btn oe-btn-xs", onClick: handleAddFont },
          "+ Add font",
        ),
      ),
      fonts.length === 0 &&
        React.createElement(
          "p",
          { className: "oe-properties-empty-hint" },
          "No fonts added yet. Add a web font to use custom typography.",
        ),
      ...fonts.map((font, i) =>
        React.createElement(FontCard, {
          key: i,
          font,
          index: i,
          expanded: expandedFonts.has(i),
          onToggle: () => toggleFont(i),
          onChange: handleFontChange,
          onRemove: handleFontRemove,
        }),
      ),
    ),

    React.createElement(
      "div",
      { className: "oe-properties-group" },
      React.createElement("div", { className: "oe-properties-group-title" }, "Tailwind CSS"),
      React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement(
          "label",
          { className: "oe-field-label oe-field-label-row" },
          React.createElement("input", {
            type: "checkbox",
            checked: tailwindEnabled,
            onChange: handleTailwindToggle,
          }),
          "Enable Tailwind CSS",
        ),
      ),
      tailwindEnabled &&
        React.createElement(
          "div",
          { className: "oe-field" },
          React.createElement("label", { className: "oe-field-label" }, "Theme Config (JSON)"),
          React.createElement("textarea", {
            className: "oe-field-input oe-field-textarea oe-field-mono",
            placeholder: '{"theme": {"extend": {"colors": {"brand": "#007291"}}}}',
            rows: 4,
            value: meta?.tailwind?.config ?? "",
            onChange: handleTailwindConfig,
          }),
        ),
    ),
  );
}
