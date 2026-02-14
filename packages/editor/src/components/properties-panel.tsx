// ─── Properties Panel ────────────────────────────────────────────────────────
// Right sidebar showing editable properties of the currently selected node.

import React, { useCallback, useMemo } from "react";
import { useEditor, useSelectedNode } from "../engine/editor-store";
import { defaultRegistry } from "../registry/component-registry";
import { Icons } from "./icons";
import type { PropertySchema, ComponentRegistry } from "../types";

// ─── Property Field ──────────────────────────────────────────────────────────

interface PropertyFieldProps {
    schema: PropertySchema;
    value: unknown;
    onChange: (key: string, value: unknown) => void;
}

function PropertyField({ schema, value, onChange }: PropertyFieldProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            let newValue: unknown = e.target.value;

            if (schema.type === "number") {
                newValue = e.target.value === "" ? undefined : Number(e.target.value);
            } else if (schema.type === "toggle") {
                newValue = (e.target as HTMLInputElement).checked;
            }

            onChange(schema.key, newValue);
        },
        [schema.key, schema.type, onChange]
    );

    const stringValue = value !== undefined && value !== null ? String(value) : "";

    switch (schema.type) {
        case "textarea":
            return React.createElement(
                "div",
                { className: "oe-field" },
                React.createElement("label", { className: "oe-field-label" }, schema.label),
                React.createElement("textarea", {
                    className: "oe-field-textarea",
                    value: stringValue,
                    onChange: handleChange,
                    placeholder: schema.placeholder ?? "",
                })
            );

        case "select":
            return React.createElement(
                "div",
                { className: "oe-field" },
                React.createElement("label", { className: "oe-field-label" }, schema.label),
                React.createElement(
                    "select",
                    {
                        className: "oe-field-select",
                        value: stringValue,
                        onChange: handleChange,
                    },
                    React.createElement("option", { value: "" }, "—"),
                    ...(schema.options ?? []).map((opt) =>
                        React.createElement(
                            "option",
                            { key: opt.value, value: opt.value },
                            opt.label
                        )
                    )
                )
            );

        case "color":
            return React.createElement(
                "div",
                { className: "oe-field" },
                React.createElement("label", { className: "oe-field-label" }, schema.label),
                React.createElement(
                    "div",
                    { className: "oe-field-color-wrapper" },
                    React.createElement("input", {
                        type: "color",
                        className: "oe-field-color-swatch",
                        value: stringValue || "#000000",
                        onChange: handleChange,
                    }),
                    React.createElement("input", {
                        type: "text",
                        className: "oe-field-input",
                        value: stringValue,
                        onChange: handleChange,
                        placeholder: "#000000",
                        style: { flex: 1 },
                    })
                )
            );

        case "toggle":
            return React.createElement(
                "div",
                { className: "oe-field" },
                React.createElement(
                    "label",
                    {
                        className: "oe-field-label",
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                        },
                    },
                    React.createElement("input", {
                        type: "checkbox",
                        checked: !!value,
                        onChange: handleChange,
                    }),
                    schema.label
                )
            );

        case "number":
            return React.createElement(
                "div",
                { className: "oe-field" },
                React.createElement("label", { className: "oe-field-label" }, schema.label),
                React.createElement("input", {
                    type: "number",
                    className: "oe-field-input",
                    value: stringValue,
                    onChange: handleChange,
                    placeholder: schema.placeholder ?? "",
                })
            );

        case "url":
        case "text":
        case "spacing":
        default:
            return React.createElement(
                "div",
                { className: "oe-field" },
                React.createElement("label", { className: "oe-field-label" }, schema.label),
                React.createElement("input", {
                    type: schema.type === "url" ? "url" : "text",
                    className: "oe-field-input",
                    value: stringValue,
                    onChange: handleChange,
                    placeholder: schema.placeholder ?? "",
                })
            );
    }
}

// ─── Properties Panel ────────────────────────────────────────────────────────

export interface PropertiesPanelProps {
    className?: string;
    registry?: ComponentRegistry;
}

/** Resolve a dotted key (e.g., "style.color") to a value from a props object */
function resolveValue(props: Record<string, unknown>, key: string): unknown {
    if (key.includes(".")) {
        const parts = key.split(".");
        let current: unknown = props;
        for (const part of parts) {
            if (current && typeof current === "object") {
                current = (current as Record<string, unknown>)[part];
            } else {
                return undefined;
            }
        }
        return current;
    }
    return props[key];
}

export function PropertiesPanel({ className, registry }: PropertiesPanelProps) {
    const { selectedNodeId, updateNode, deleteNode } = useEditor();
    const selectedNode = useSelectedNode();
    const reg = registry ?? defaultRegistry;

    const definition = useMemo(
        () => (selectedNode ? reg.get(selectedNode.type) : undefined),
        [selectedNode, reg]
    );

    const handlePropertyChange = useCallback(
        (key: string, value: unknown) => {
            if (!selectedNodeId) return;

            // Handle dotted keys (e.g., "style.color")
            if (key.includes(".")) {
                const parts = key.split(".");
                // For now we handle 2-level deep (e.g., style.color)
                if (parts.length === 2) {
                    const [parent, child] = parts;
                    updateNode(selectedNodeId, {
                        [parent]: {
                            ...((resolveValue(selectedNode?.props ?? {}, parent) as Record<string, unknown>) ?? {}),
                            [child]: value === "" ? undefined : value,
                        },
                    });
                    return;
                }
            }

            updateNode(selectedNodeId, { [key]: value === "" ? undefined : value });
        },
        [selectedNodeId, selectedNode, updateNode]
    );

    const handleDelete = useCallback(() => {
        if (selectedNodeId) {
            deleteNode(selectedNodeId);
        }
    }, [selectedNodeId, deleteNode]);

    if (!selectedNode || !definition) {
        return React.createElement(
            "div",
            { className: `oe-properties ${className ?? ""}` },
            React.createElement(
                "div",
                { className: "oe-properties-empty" },
                React.createElement(Icons.settings, { size: 32 }),
                React.createElement("p", null, "Select an element to edit its properties")
            )
        );
    }

    // Group properties
    const groups: Record<string, PropertySchema[]> = {};
    for (const prop of definition.properties) {
        const group = prop.group ?? "content";
        if (!groups[group]) groups[group] = [];
        groups[group].push(prop);
    }

    const groupLabels: Record<string, string> = {
        content: "Content",
        layout: "Layout",
        style: "Style",
    };

    const groupOrder = ["content", "layout", "style"];

    return React.createElement(
        "div",
        { className: `oe-properties ${className ?? ""}` },

        // Header
        React.createElement(
            "div",
            { className: "oe-properties-header" },
            React.createElement(
                "span",
                { className: "oe-properties-title" },
                definition.label
            ),
            React.createElement(
                "button",
                {
                    className: "oe-btn-icon",
                    onClick: handleDelete,
                    title: "Delete element",
                    style: { color: "var(--oe-danger)" },
                },
                React.createElement(Icons.trash, { size: 16 })
            )
        ),

        // Property groups
        ...groupOrder
            .filter((g) => groups[g] && groups[g].length > 0)
            .map((group) =>
                React.createElement(
                    "div",
                    { key: group, className: "oe-properties-group" },
                    React.createElement(
                        "div",
                        { className: "oe-properties-group-title" },
                        groupLabels[group] ?? group
                    ),
                    ...groups[group].map((prop) =>
                        React.createElement(PropertyField, {
                            key: prop.key,
                            schema: prop,
                            value: resolveValue(selectedNode.props, prop.key),
                            onChange: handlePropertyChange,
                        })
                    )
                )
            )
    );
}
