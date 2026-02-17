import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useVariables } from "../../engine/editor-store";
import { isValidVariableKey } from "./utils";

export interface VariableInserterProps {
  selectedNodeId?: string | null;
  contentKey?: string;
  currentContent?: string;
  onInsert: (variableName: string) => void;
  onCreateAndInsert: (name: string, fallback: string) => void;
}

export function VariableInserter({
  selectedNodeId,
  contentKey,
  currentContent,
  onInsert,
  onCreateAndInsert,
}: VariableInserterProps) {
  const variables = useVariables();
  const [variableSelectOpen, setVariableSelectOpen] = useState(false);
  const [variableSearch, setVariableSearch] = useState("");
  const [newVarName, setNewVarName] = useState("");
  const [newVarFallback, setNewVarFallback] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const comboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variableSelectOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [variableSelectOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setVariableSelectOpen(false);
        setVariableSearch("");
        setShowCreateForm(false);
        setNewVarName("");
        setNewVarFallback("");
      }
    };
    if (variableSelectOpen) {
      window.document.addEventListener("mousedown", handleClickOutside);
      return () => window.document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [variableSelectOpen]);

  const handleInsertVariable = useCallback(
    (variableName: string) => {
      onInsert(variableName);
      setVariableSelectOpen(false);
      setVariableSearch("");
      setShowCreateForm(false);
    },
    [onInsert],
  );

  const filteredVariables = useMemo(() => {
    const entries = Object.entries(variables);
    const search = variableSearch.toLowerCase().trim();
    if (!search) return entries;
    return entries.filter(([name]) => name.toLowerCase().includes(search));
  }, [variables, variableSearch]);

  const variableCount = filteredVariables.length;

  return React.createElement(
    "div",
    { className: "oe-properties-group" },
    React.createElement(
      "div",
      { className: "oe-properties-group-title" },
      "Insert variable",
    ),
    React.createElement(
      "div",
      { className: "oe-variable-combobox", ref: comboboxRef },
      variableSelectOpen
        ? React.createElement(
            "div",
            { className: "oe-variable-combobox-dropdown" },
            React.createElement("input", {
              ref: searchInputRef,
              type: "text",
              className: "oe-field-input",
              placeholder: "Search or create variable…",
              value: variableSearch,
              onChange: (e) => setVariableSearch(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Escape") {
                  setVariableSelectOpen(false);
                  setVariableSearch("");
                  setShowCreateForm(false);
                }
              },
            }),
            filteredVariables.length > 0 &&
              React.createElement(
                "div",
                { className: "oe-variable-combobox-list" },
                filteredVariables.map(([name, def]) =>
                  React.createElement(
                    "button",
                    {
                      key: name,
                      type: "button",
                      className: "oe-variable-combobox-item",
                      onClick: () => handleInsertVariable(name),
                    },
                    React.createElement(
                      "code",
                      { className: "oe-variable-combobox-key" },
                      `{{${name}}}`,
                    ),
                    React.createElement(
                      "span",
                      { className: "oe-variable-combobox-fallback" },
                      def.fallback || "—",
                    ),
                  ),
                ),
              ),
            (variableSearch.trim() &&
              !variables[variableSearch.trim()] &&
              isValidVariableKey(variableSearch.trim())) ||
              showCreateForm
              ? React.createElement(
                  "div",
                  { className: "oe-variable-combobox-create" },
                  React.createElement(
                    "div",
                    { className: "oe-variable-combobox-create-header" },
                    "Create new variable",
                  ),
                  React.createElement("input", {
                    type: "text",
                    className: "oe-field-input",
                    placeholder: "variableName",
                    value: showCreateForm ? newVarName : variableSearch.trim(),
                    onChange: (e) => setNewVarName(e.target.value),
                    "data-invalid":
                      newVarName.trim() &&
                      !isValidVariableKey(newVarName.trim())
                        ? "true"
                        : undefined,
                  }),
                  React.createElement("input", {
                    type: "text",
                    className: "oe-field-input",
                    placeholder: "Fallback text",
                    value: newVarFallback,
                    onChange: (e) => setNewVarFallback(e.target.value),
                  }),
                  React.createElement(
                    "button",
                    {
                      type: "button",
                      className: "oe-btn oe-btn-primary",
                      onClick: () => {
                        const name = newVarName.trim() || variableSearch.trim();
                        const fallback = newVarFallback.trim();
                        if (!isValidVariableKey(name)) return;
                        
                        onCreateAndInsert(name, fallback);
                        setNewVarName("");
                        setNewVarFallback("");
                        setVariableSelectOpen(false);
                        setVariableSearch("");
                        setShowCreateForm(false);
                      },
                      disabled:
                        !isValidVariableKey(
                          showCreateForm ? newVarName.trim() : variableSearch.trim(),
                        ),
                    },
                    "Create & Insert",
                  ),
                )
              : filteredVariables.length === 0 &&
                variableSearch.trim() &&
                React.createElement(
                  "div",
                  { className: "oe-variable-combobox-empty" },
                  "No variables found. Type a valid name to create one.",
                ),
          )
        : React.createElement(
            "button",
            {
              type: "button",
              className: "oe-btn",
              onClick: () => setVariableSelectOpen(true),
            },
            variableCount > 0
              ? `Insert variable (${variableCount})`
              : "Create variable…",
          ),
    ),
  );
}
