// ─── Variable Manager ─────────────────────────────────────────────────────────
// Manages document-level variables (unique key + fallback) for template interpolation.

import React, { useCallback, useState } from "react";
import { useEditor } from "../engine/editor-store";
import { Icons } from "./icons";
import type { VariableDefinition } from "../types";

const VARIABLE_KEY_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function isValidVariableKey(key: string): boolean {
  return key.length > 0 && VARIABLE_KEY_REGEX.test(key);
}

export interface VariableManagerProps {
  className?: string;
}

export function VariableManager({ className }: VariableManagerProps) {
  const { document, updateVariables } = useEditor();
  const variables = document.variables ?? {};
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newFallback, setNewFallback] = useState("");
  const [addMode, setAddMode] = useState(false);

  const entries = Object.entries(variables);

  const handleSaveEdit = useCallback(
    (key: string, fallback: string) => {
      const next = { ...variables, [key]: { fallback } };
      updateVariables(next);
      setEditingKey(null);
    },
    [variables, updateVariables]
  );

  const handleDelete = useCallback(
    (key: string) => {
      const next = { ...variables };
      delete next[key];
      updateVariables(next);
      setEditingKey(null);
    },
    [variables, updateVariables]
  );

  const handleAdd = useCallback(() => {
    const k = newKey.trim();
    const f = newFallback.trim();
    if (!isValidVariableKey(k)) return;
    const next = { ...variables, [k]: { fallback: f } };
    updateVariables(next);
    setNewKey("");
    setNewFallback("");
    setAddMode(false);
  }, [variables, updateVariables, newKey, newFallback]);

  const startAdd = useCallback(() => {
    setAddMode(true);
    setNewKey("");
    setNewFallback("");
  }, []);

  const cancelAdd = useCallback(() => {
    setAddMode(false);
    setNewKey("");
    setNewFallback("");
  }, []);

  return React.createElement(
    "div",
    { className: `oe-variable-manager ${className ?? ""}` },
    React.createElement(
      "div",
      { className: "oe-variable-manager-header" },
      React.createElement("span", { className: "oe-properties-group-title" }, "Variables"),
      React.createElement(
        "button",
        {
          type: "button",
          className: "oe-btn-icon",
          onClick: addMode ? cancelAdd : startAdd,
          title: addMode ? "Cancel" : "Add variable",
        },
        React.createElement(addMode ? Icons.close : Icons.plus, { size: 14 })
      )
    ),
    addMode &&
      React.createElement(
        "div",
        { className: "oe-variable-manager-add" },
        React.createElement("input", {
          type: "text",
          className: "oe-field-input",
          placeholder: "variableName",
          value: newKey,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewKey(e.target.value),
          "data-invalid": newKey.trim() && !isValidVariableKey(newKey.trim()) ? "true" : undefined,
        }),
        React.createElement("input", {
          type: "text",
          className: "oe-field-input",
          placeholder: "Fallback text",
          value: newFallback,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewFallback(e.target.value),
        }),
        React.createElement(
          "button",
          {
            type: "button",
            className: "oe-btn oe-btn-primary",
            onClick: handleAdd,
            disabled: !isValidVariableKey(newKey.trim()),
          },
          "Add"
        )
      ),
    entries.length === 0 && !addMode
      ? React.createElement(
          "div",
          { className: "oe-variable-manager-empty" },
          "No variables. Use {{name}} in text and add variables here."
        )
      : entries.map(([key, def]) =>
          editingKey === key
            ? React.createElement(VariableRowEdit, {
                key,
                name: key,
                fallback: def.fallback,
                onSave: (fallback) => handleSaveEdit(key, fallback),
                onDelete: () => handleDelete(key),
                onCancel: () => setEditingKey(null),
              })
            : React.createElement(
                "div",
                {
                  key,
                  className: "oe-variable-manager-row",
                  onClick: () => setEditingKey(key),
                },
                React.createElement("code", { className: "oe-variable-manager-key" }, `{{${key}}}`),
                React.createElement("span", { className: "oe-variable-manager-fallback" }, def.fallback || "—")
              )
        )
  );
}

interface VariableRowEditProps {
  name: string;
  fallback: string;
  onSave: (fallback: string) => void;
  onDelete: () => void;
  onCancel: () => void;
}

function VariableRowEdit({ name, fallback, onSave, onDelete, onCancel }: VariableRowEditProps) {
  const [value, setValue] = useState(fallback);
  return React.createElement(
    "div",
    { className: "oe-variable-manager-row oe-variable-manager-row-edit" },
    React.createElement("code", { className: "oe-variable-manager-key" }, `{{${name}}}`),
    React.createElement("input", {
      type: "text",
      className: "oe-field-input",
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
      placeholder: "Fallback",
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
    }),
    React.createElement(
      "div",
      { className: "oe-variable-manager-actions" },
      React.createElement(
        "button",
        { type: "button", className: "oe-btn-icon", onClick: () => onSave(value), title: "Save" },
        React.createElement(Icons.check, { size: 14 })
      ),
      React.createElement(
        "button",
        { type: "button", className: "oe-btn-icon", onClick: onCancel, title: "Cancel" },
        React.createElement(Icons.close, { size: 14 })
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "oe-btn-icon",
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete();
          },
          title: "Delete",
          style: { color: "var(--oe-danger)" },
        },
        React.createElement(Icons.trash, { size: 14 })
      )
    )
  );
}
