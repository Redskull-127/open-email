import React, { useCallback, useMemo } from "react";
import { useEditor, useSelectedNode } from "../../engine/editor-store";
import { defaultRegistry } from "../../registry/component-registry";
import { insertVariableIntoContent } from "../../utils/dom-helpers";
import type { ComponentRegistry } from "../../types";
import { PropertiesPanelEmpty } from "./properties-panel-empty";
import { PropertiesPanelHeader } from "./properties-panel-header";
import { VariableInserter } from "./variable-inserter";
import { PropertiesGroup } from "./properties-group";
import { CONTENT_NODE_TYPES, CONTENT_KEY, GROUP_ORDER } from "./utils";
import { buildNodePatchFromPropertyKey } from "../../utils/node-props";

export interface PropertiesPanelProps {
  className?: string;
  registry?: ComponentRegistry;
}

export function PropertiesPanel({ className, registry }: PropertiesPanelProps) {
  const {
    selectedNodeId,
    document: emailDocument,
    updateNode,
    deleteNode,
    updateVariables,
    updateDocumentMeta,
    createVariableAndInsert,
  } = useEditor();
  const selectedNode = useSelectedNode();
  const reg = registry ?? defaultRegistry;

  const definition = useMemo(
    () => (selectedNode ? reg.get(selectedNode.type) : undefined),
    [selectedNode, reg],
  );

  const handlePropertyChange = useCallback(
    (key: string, value: unknown) => {
      if (!selectedNodeId) return;
      updateNode(
        selectedNodeId,
        buildNodePatchFromPropertyKey(selectedNode?.props ?? {}, key, value),
      );
    },
    [selectedNodeId, selectedNode, updateNode],
  );

  const handleDelete = useCallback(() => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
    }
  }, [selectedNodeId, deleteNode]);

  const contentKey =
    selectedNode &&
    CONTENT_KEY[selectedNode.type as (typeof CONTENT_NODE_TYPES)[number]];
  const currentContent = (contentKey && selectedNode?.props?.[contentKey]) as
    | string
    | undefined;

  const handleInsertVariable = useCallback(
    (variableName: string) => {
      if (!selectedNodeId || !contentKey) return;
      const newValue = insertVariableIntoContent(currentContent, variableName);
      updateNode(selectedNodeId, { [contentKey]: newValue });
    },
    [selectedNodeId, contentKey, currentContent, updateNode],
  );

  const handleCreateAndInsert = useCallback(
    (name: string, fallback: string) => {
      const variables = { ...(emailDocument.variables ?? {}), [name]: { fallback } };
      if (selectedNodeId && contentKey) {
        const newValue = insertVariableIntoContent(currentContent, name);
        createVariableAndInsert(variables, selectedNodeId, contentKey, newValue);
      } else {
        updateVariables(variables);
      }
    },
    [emailDocument.variables, createVariableAndInsert, updateVariables, selectedNodeId, contentKey, currentContent],
  );

  const groups = useMemo(() => {
    if (!definition?.properties) return {};
    const grouped: Record<string, typeof definition.properties> = {};
    for (const prop of definition.properties) {
      const group = prop.group ?? "content";
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(prop);
    }
    return grouped;
  }, [definition?.properties]);

  const fontFamilyOptions = useMemo(
    () =>
      [...new Set((emailDocument.meta.fonts ?? []).map((font) => font.fontFamily?.trim()).filter((font): font is string => !!font))],
    [emailDocument.meta.fonts],
  );

  const handleMetaChange = useCallback(
    (update: Partial<typeof emailDocument.meta>) => {
      updateDocumentMeta(update);
    },
    [updateDocumentMeta],
  );

  if (!selectedNode || !definition) {
    return React.createElement(PropertiesPanelEmpty, {
      className,
      meta: emailDocument.meta,
      onMetaChange: handleMetaChange,
    });
  }

  const canInsertVariable =
    selectedNode &&
    CONTENT_NODE_TYPES.includes(
      selectedNode.type as (typeof CONTENT_NODE_TYPES)[number],
    );

  return React.createElement(
    "div",
    { className: `oe-properties ${className ?? ""}` },
    React.createElement(PropertiesPanelHeader, {
      title: definition.label,
      onDelete: handleDelete,
    }),
    canInsertVariable &&
      React.createElement(VariableInserter, {
        selectedNodeId: selectedNodeId || undefined,
        contentKey: contentKey || undefined,
        currentContent: currentContent || undefined,
        onInsert: handleInsertVariable,
        onCreateAndInsert: handleCreateAndInsert,
      }),
    ...GROUP_ORDER
      .filter((g) => groups[g] && groups[g].length > 0)
      .map((group) =>
        React.createElement(PropertiesGroup, {
          key: group,
          group,
          properties: groups[group],
          nodeProps: selectedNode.props ?? {},
          onChange: handlePropertyChange,
          fontFamilyOptions,
        }),
      ),
  );
}
