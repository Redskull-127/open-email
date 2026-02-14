"use client";

// src/components/email-editor.tsx
import React10 from "react";

// src/engine/editor-store.ts
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo
} from "react";

// src/engine/operations.ts
import { nanoid } from "nanoid";
function generateId() {
  return nanoid(10);
}
function createNode(type, props = {}, children) {
  return {
    id: generateId(),
    type,
    props,
    ...children ? { children } : {}
  };
}
function cloneNode(node) {
  return {
    ...node,
    id: generateId(),
    props: { ...node.props },
    children: node.children?.map(cloneNode)
  };
}
function findNode(root, nodeId) {
  if (root.id === nodeId) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, nodeId);
      if (found) return found;
    }
  }
  return null;
}
function findParent(root, nodeId) {
  if (root.children) {
    for (const child of root.children) {
      if (child.id === nodeId) return root;
      const found = findParent(child, nodeId);
      if (found) return found;
    }
  }
  return null;
}
function getNodePath(root, nodeId) {
  if (root.id === nodeId) return [root.id];
  if (root.children) {
    for (const child of root.children) {
      const childPath = getNodePath(child, nodeId);
      if (childPath.length > 0) return [root.id, ...childPath];
    }
  }
  return [];
}
function updateNode(root, nodeId, newProps) {
  if (root.id === nodeId) {
    return {
      ...root,
      props: { ...root.props, ...newProps }
    };
  }
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) => updateNode(child, nodeId, newProps))
    };
  }
  return root;
}
function addNode(root, parentId, node, index) {
  if (root.id === parentId) {
    const children = root.children ? [...root.children] : [];
    if (index !== void 0 && index >= 0 && index <= children.length) {
      children.splice(index, 0, node);
    } else {
      children.push(node);
    }
    return { ...root, children };
  }
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) => addNode(child, parentId, node, index))
    };
  }
  return root;
}
function removeNode(root, nodeId) {
  if (root.children) {
    const filtered = root.children.filter((child) => child.id !== nodeId);
    return {
      ...root,
      children: filtered.map((child) => removeNode(child, nodeId))
    };
  }
  return root;
}
function moveNode(root, nodeId, newParentId, index) {
  const node = findNode(root, nodeId);
  if (!node) return root;
  const withoutNode = removeNode(root, nodeId);
  return addNode(withoutNode, newParentId, node, index);
}
function flattenTree(root) {
  const result = [root];
  if (root.children) {
    for (const child of root.children) {
      result.push(...flattenTree(child));
    }
  }
  return result;
}
function validateDocument(doc) {
  const errors = [];
  if (doc.version !== 1) {
    errors.push(`Unsupported document version: ${doc.version}`);
  }
  if (!doc.meta?.title) {
    errors.push("Document must have a title");
  }
  if (!doc.body) {
    errors.push("Document must have a body");
  }
  const allNodes = flattenTree(doc.body);
  const ids = /* @__PURE__ */ new Set();
  for (const node of allNodes) {
    if (ids.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    ids.add(node.id);
  }
  return errors;
}
function createEmptyDocument(title = "Untitled Email") {
  return {
    version: 1,
    meta: { title },
    body: createNode("container", { maxWidth: "600px" }, [
      createNode("section", {}, [
        createNode("text", { content: "Start building your email..." })
      ])
    ])
  };
}

// src/engine/editor-store.ts
function editorReducer(state, action) {
  switch (action.type) {
    case "SET_DOCUMENT":
      return {
        ...state,
        document: action.payload,
        selectedNodeId: null,
        isDirty: false
      };
    case "SELECT_NODE":
      return {
        ...state,
        selectedNodeId: action.payload
      };
    case "UPDATE_NODE":
      return {
        ...state,
        document: {
          ...state.document,
          body: updateNode(state.document.body, action.payload.id, action.payload.props)
        },
        isDirty: true
      };
    case "ADD_NODE":
      return {
        ...state,
        document: {
          ...state.document,
          body: addNode(
            state.document.body,
            action.payload.parentId,
            action.payload.node,
            action.payload.index
          )
        },
        selectedNodeId: action.payload.node.id,
        isDirty: true
      };
    case "DELETE_NODE": {
      const newSelectedId = state.selectedNodeId === action.payload ? null : state.selectedNodeId;
      return {
        ...state,
        document: {
          ...state.document,
          body: removeNode(state.document.body, action.payload)
        },
        selectedNodeId: newSelectedId,
        isDirty: true
      };
    }
    case "MOVE_NODE":
      return {
        ...state,
        document: {
          ...state.document,
          body: moveNode(
            state.document.body,
            action.payload.nodeId,
            action.payload.newParentId,
            action.payload.index
          )
        },
        isDirty: true
      };
    case "SET_MODE":
      return {
        ...state,
        mode: action.payload
      };
    case "MARK_CLEAN":
      return {
        ...state,
        isDirty: false
      };
    default:
      return state;
  }
}
var EditorContext = createContext(null);
function EditorProvider({
  initialDocument,
  onChange,
  children
}) {
  const [state, dispatch] = useReducer(editorReducer, {
    document: initialDocument ?? createEmptyDocument(),
    selectedNodeId: null,
    mode: "visual",
    isDirty: false
  });
  const wrappedDispatch = useCallback(
    (action) => {
      dispatch(action);
      if (onChange && ["UPDATE_NODE", "ADD_NODE", "DELETE_NODE", "MOVE_NODE"].includes(action.type)) {
        const newState = editorReducer(state, action);
        onChange(newState.document);
      }
    },
    [onChange, state]
  );
  const value = useMemo(
    () => ({ state, dispatch: wrappedDispatch }),
    [state, wrappedDispatch]
  );
  return React.createElement(EditorContext.Provider, { value }, children);
}
function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used within an <EditorProvider>");
  }
  const { state, dispatch } = ctx;
  const actions = useMemo(
    () => ({
      /** Set the entire document */
      setDocument: (doc) => dispatch({ type: "SET_DOCUMENT", payload: doc }),
      /** Select a node by ID */
      selectNode: (id) => dispatch({ type: "SELECT_NODE", payload: id }),
      /** Update a node's props */
      updateNode: (id, props) => dispatch({ type: "UPDATE_NODE", payload: { id, props } }),
      /** Add a new node as a child of parentId */
      addNode: (parentId, node, index) => dispatch({ type: "ADD_NODE", payload: { parentId, node, index } }),
      /** Delete a node by ID */
      deleteNode: (id) => dispatch({ type: "DELETE_NODE", payload: id }),
      /** Move a node to a new parent */
      moveNode: (nodeId, newParentId, index) => dispatch({ type: "MOVE_NODE", payload: { nodeId, newParentId, index } }),
      /** Switch editor mode */
      setMode: (mode) => dispatch({ type: "SET_MODE", payload: mode }),
      /** Mark the document as clean (saved) */
      markClean: () => dispatch({ type: "MARK_CLEAN" })
    }),
    [dispatch]
  );
  return {
    /** Current editor state */
    ...state,
    /** Editor action creators */
    ...actions,
    /** Raw dispatch for custom actions */
    dispatch
  };
}
function useSelectedNode() {
  const { document, selectedNodeId } = useEditor();
  if (!selectedNodeId) return null;
  return findNode(document.body, selectedNodeId);
}
function useNode(nodeId) {
  const { document } = useEditor();
  return findNode(document.body, nodeId);
}

// src/components/editor-toolbar.tsx
import React4, { useCallback as useCallback2, useState } from "react";

// src/renderer/json-renderer.ts
function exportToJSON(document, pretty = true) {
  return JSON.stringify(document, null, pretty ? 2 : void 0);
}
function importFromJSON(json) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON string");
  }
  const doc = parsed;
  if (!doc || typeof doc !== "object") {
    throw new Error("Invalid document: must be an object");
  }
  if (doc.version !== 1) {
    throw new Error(`Unsupported document version: ${doc.version}`);
  }
  if (!doc.body || !doc.body.type || !doc.body.id) {
    throw new Error("Invalid document: body must have type and id");
  }
  if (!doc.meta || !doc.meta.title) {
    throw new Error("Invalid document: meta.title is required");
  }
  const errors = validateDocument(doc);
  if (errors.length > 0) {
    throw new Error(`Invalid document:
${errors.join("\n")}`);
  }
  return doc;
}

// src/renderer/html-renderer.ts
import { render } from "@react-email/render";

// src/renderer/react-email-renderer.ts
import React2 from "react";
import {
  Html,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Button,
  Img,
  Link,
  Hr,
  Head,
  Preview
} from "@react-email/components";
var componentMap = {
  container: Container,
  section: Section,
  row: Row,
  column: Column,
  text: Text,
  heading: Heading,
  button: Button,
  image: Img,
  link: Link,
  hr: Hr
};
function resolveProps(props) {
  const resolved = {};
  const styleObj = {};
  const STYLE_PROPS = /* @__PURE__ */ new Set([
    "maxWidth",
    "backgroundColor",
    "color",
    "borderRadius",
    "borderColor",
    "borderWidth",
    "padding",
    "margin",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "lineHeight",
    "textAlign",
    "verticalAlign"
  ]);
  for (const [key, value] of Object.entries(props)) {
    if (value === void 0 || value === null || value === "") continue;
    if (key.startsWith("style.")) {
      const styleProp = key.slice(6);
      styleObj[styleProp] = value;
    } else if (STYLE_PROPS.has(key)) {
      styleObj[key] = value;
    } else {
      resolved[key] = value;
    }
  }
  if (props.style && typeof props.style === "object") {
    Object.assign(styleObj, props.style);
  }
  if (Object.keys(styleObj).length > 0) {
    resolved.style = {
      ...resolved.style ?? {},
      ...styleObj
    };
  }
  return resolved;
}
function renderNode(node) {
  const Component = componentMap[node.type];
  if (!Component) {
    return React2.createElement(
      "div",
      { key: node.id, "data-unknown-type": node.type },
      node.children?.map(renderNode)
    );
  }
  const resolvedProps = resolveProps(node.props);
  const { content, text, ...restProps } = resolvedProps;
  if (node.type === "text" || node.type === "heading" || node.type === "link") {
    return React2.createElement(
      Component,
      { key: node.id, ...restProps },
      content ?? ""
    );
  }
  if (node.type === "button") {
    return React2.createElement(
      Component,
      { key: node.id, ...restProps },
      text ?? ""
    );
  }
  if (!node.children || node.children.length === 0) {
    if (node.type === "spacer") {
      return React2.createElement("div", {
        key: node.id,
        style: { height: resolvedProps.height ?? "20px" }
      });
    }
    return React2.createElement(Component, { key: node.id, ...resolvedProps });
  }
  return React2.createElement(
    Component,
    { key: node.id, ...resolvedProps },
    node.children.map(renderNode)
  );
}
function renderToReactEmail(document) {
  const bodyContent = renderNode(document.body);
  return React2.createElement(
    Html,
    { lang: "en", dir: "ltr" },
    React2.createElement(Head, null),
    document.meta.previewText ? React2.createElement(Preview, null, document.meta.previewText) : null,
    React2.createElement(
      Body,
      {
        style: {
          backgroundColor: "#f6f9fc",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
          margin: "0",
          padding: "0"
        }
      },
      bodyContent
    )
  );
}

// src/renderer/html-renderer.ts
async function renderToHTML(document) {
  const element = renderToReactEmail(document);
  const html = await render(element);
  return html;
}
async function renderToPlainText(document) {
  const element = renderToReactEmail(document);
  const text = await render(element, { plainText: true });
  return text;
}

// src/components/icons.tsx
import React3 from "react";
function icon(paths, viewBox = "0 0 24 24") {
  return function Icon({ size = 16, className }) {
    return React3.createElement("svg", {
      width: size,
      height: size,
      viewBox,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className,
      dangerouslySetInnerHTML: { __html: paths }
    });
  };
}
var Icons = {
  box: icon('<rect x="3" y="3" width="18" height="18" rx="2"/>'),
  layout: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>'),
  columns: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>'),
  sidebar: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>'),
  type: icon('<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>'),
  heading: icon('<path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/>'),
  mousePointer: icon('<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/>'),
  image: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>'),
  externalLink: icon('<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'),
  minus: icon('<line x1="5" y1="12" x2="19" y2="12"/>'),
  moveVertical: icon('<polyline points="8 18 12 22 16 18"/><polyline points="8 6 12 2 16 6"/><line x1="12" y1="2" x2="12" y2="22"/>'),
  eye: icon('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
  code: icon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
  monitor: icon('<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'),
  download: icon('<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'),
  trash: icon('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>'),
  plus: icon('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),
  layers: icon('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'),
  chevronRight: icon('<polyline points="9 18 15 12 9 6"/>'),
  chevronDown: icon('<polyline points="6 9 12 15 18 9"/>'),
  settings: icon('<circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-9-11h2m18 0h2M5.6 5.6l1.4 1.4m9.9 9.9l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/>'),
  copy: icon('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>')
};
function getIcon(name) {
  return Icons[name] ?? Icons.box;
}

// src/components/editor-toolbar.tsx
function EditorToolbar({
  className,
  modes = ["visual", "code", "preview"],
  actions,
  onExportHTML,
  onExportJSON,
  showExportJSON = true,
  showExportHTML = true,
  components = {}
}) {
  const { mode, setMode, document } = useEditor();
  const [exporting, setExporting] = useState(false);
  const modeLabels = {
    visual: { label: "Visual", Icon: Icons.eye },
    code: { label: "Code", Icon: Icons.code },
    preview: { label: "Preview", Icon: Icons.monitor }
  };
  const handleExportHTML = useCallback2(async () => {
    setExporting(true);
    try {
      const html = await renderToHTML(document);
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
  }, [document, onExportHTML]);
  const handleExportJSON = useCallback2(() => {
    const json = exportToJSON(document);
    if (onExportJSON) {
      onExportJSON(json);
    } else {
      navigator.clipboard.writeText(json);
    }
  }, [document, onExportJSON]);
  const { ExportJSONButton, ExportHTMLButton } = components;
  return React4.createElement(
    "div",
    { className: `oe-toolbar ${className ?? ""}` },
    // Left section — mode switcher
    React4.createElement(
      "div",
      { className: "oe-toolbar-section" },
      React4.createElement(
        "div",
        { className: "oe-mode-switcher" },
        ...modes.map((m) => {
          const { label, Icon } = modeLabels[m];
          return React4.createElement(
            "button",
            {
              key: m,
              className: "oe-mode-btn",
              "data-active": mode === m ? "true" : "false",
              onClick: () => setMode(m),
              title: `${label} mode`
            },
            React4.createElement(Icon, { size: 14 }),
            ` ${label}`
          );
        })
      )
    ),
    // Right section — export actions
    React4.createElement(
      "div",
      { className: "oe-toolbar-section" },
      // Custom actions
      actions,
      // JSON Export
      showExportJSON && (ExportJSONButton ? React4.createElement(ExportJSONButton, { onClick: handleExportJSON }) : React4.createElement(
        "button",
        {
          className: "oe-btn",
          onClick: handleExportJSON,
          title: "Export JSON to clipboard"
        },
        React4.createElement(Icons.copy, { size: 14 }),
        "JSON"
      )),
      // HTML Export
      showExportHTML && (ExportHTMLButton ? React4.createElement(ExportHTMLButton, {
        onClick: handleExportHTML,
        loading: exporting
      }) : React4.createElement(
        "button",
        {
          className: "oe-btn oe-btn-primary",
          onClick: handleExportHTML,
          disabled: exporting,
          title: "Export HTML to clipboard"
        },
        React4.createElement(Icons.download, { size: 14 }),
        exporting ? "Exporting\u2026" : "Export HTML"
      ))
    )
  );
}

// src/components/editor-sidebar.tsx
import React7, { useState as useState3, useCallback as useCallback4 } from "react";

// src/registry/component-registry.ts
function createRegistry(definitions) {
  const registry = /* @__PURE__ */ new Map();
  for (const def of definitions) {
    registry.set(def.type, def);
  }
  return registry;
}
function mergeRegistries(base, overrides) {
  const merged = new Map(base);
  for (const def of overrides) {
    merged.set(def.type, def);
  }
  return merged;
}
var defaultDefinitions = [
  // ─── Layout Components ─────────────────────────────────────────────
  {
    type: "container",
    label: "Container",
    icon: "box",
    category: "layout",
    description: "Centers content with max-width constraint",
    defaultProps: { maxWidth: "600px" },
    acceptsChildren: true,
    properties: [
      {
        key: "maxWidth",
        label: "Max Width",
        type: "text",
        defaultValue: "600px",
        group: "layout",
        placeholder: "e.g. 600px"
      },
      {
        key: "style.backgroundColor",
        label: "Background",
        type: "color",
        group: "style"
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 20px"
      }
    ]
  },
  {
    type: "section",
    label: "Section",
    icon: "layout",
    category: "layout",
    description: "Groups content into a section",
    defaultProps: {},
    acceptsChildren: true,
    properties: [
      {
        key: "style.backgroundColor",
        label: "Background",
        type: "color",
        group: "style"
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 20px 0"
      }
    ]
  },
  {
    type: "row",
    label: "Row",
    icon: "columns",
    category: "layout",
    description: "Horizontal row for multi-column layouts",
    defaultProps: {},
    acceptsChildren: true,
    allowedChildTypes: ["column"],
    properties: [
      {
        key: "style.backgroundColor",
        label: "Background",
        type: "color",
        group: "style"
      }
    ]
  },
  {
    type: "column",
    label: "Column",
    icon: "sidebar",
    category: "layout",
    description: "Column inside a row",
    defaultProps: {},
    acceptsChildren: true,
    properties: [
      {
        key: "style.width",
        label: "Width",
        type: "text",
        group: "layout",
        placeholder: "e.g. 50%, 300px"
      },
      {
        key: "style.verticalAlign",
        label: "Vertical Align",
        type: "select",
        options: [
          { label: "Top", value: "top" },
          { label: "Middle", value: "middle" },
          { label: "Bottom", value: "bottom" }
        ],
        group: "layout"
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px"
      }
    ]
  },
  // ─── Content Components ────────────────────────────────────────────
  {
    type: "text",
    label: "Text",
    icon: "type",
    category: "content",
    description: "Paragraph text block",
    defaultProps: { content: "Type your text here..." },
    acceptsChildren: false,
    properties: [
      {
        key: "content",
        label: "Content",
        type: "textarea",
        defaultValue: "Type your text here...",
        group: "content"
      },
      {
        key: "style.fontSize",
        label: "Font Size",
        type: "text",
        group: "style",
        placeholder: "e.g. 16px"
      },
      {
        key: "style.fontWeight",
        label: "Font Weight",
        type: "select",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Medium", value: "500" },
          { label: "Semi Bold", value: "600" },
          { label: "Bold", value: "bold" }
        ],
        group: "style"
      },
      {
        key: "style.color",
        label: "Color",
        type: "color",
        group: "style"
      },
      {
        key: "style.textAlign",
        label: "Alignment",
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" }
        ],
        group: "style"
      },
      {
        key: "style.lineHeight",
        label: "Line Height",
        type: "text",
        group: "style",
        placeholder: "e.g. 1.6"
      },
      {
        key: "style.fontFamily",
        label: "Font Family",
        type: "text",
        group: "style",
        placeholder: "e.g. Arial, sans-serif"
      }
    ]
  },
  {
    type: "heading",
    label: "Heading",
    icon: "heading",
    category: "content",
    description: "Heading text (H1\u2013H6)",
    defaultProps: { content: "Heading", as: "h2" },
    acceptsChildren: false,
    properties: [
      {
        key: "content",
        label: "Content",
        type: "text",
        defaultValue: "Heading",
        group: "content"
      },
      {
        key: "as",
        label: "Level",
        type: "select",
        defaultValue: "h2",
        options: [
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
          { label: "H4", value: "h4" },
          { label: "H5", value: "h5" },
          { label: "H6", value: "h6" }
        ],
        group: "content"
      },
      {
        key: "style.color",
        label: "Color",
        type: "color",
        group: "style"
      },
      {
        key: "style.textAlign",
        label: "Alignment",
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" }
        ],
        group: "style"
      },
      {
        key: "style.fontFamily",
        label: "Font Family",
        type: "text",
        group: "style",
        placeholder: "e.g. Arial, sans-serif"
      }
    ]
  },
  {
    type: "button",
    label: "Button",
    icon: "mouse-pointer",
    category: "content",
    description: "Call-to-action button with link",
    defaultProps: {
      text: "Click me",
      href: "https://example.com",
      backgroundColor: "#5046e5",
      color: "#ffffff",
      borderRadius: "6px",
      padding: "12px 24px"
    },
    acceptsChildren: false,
    properties: [
      {
        key: "text",
        label: "Text",
        type: "text",
        defaultValue: "Click me",
        group: "content"
      },
      {
        key: "href",
        label: "URL",
        type: "url",
        group: "content",
        placeholder: "https://..."
      },
      {
        key: "backgroundColor",
        label: "Background",
        type: "color",
        defaultValue: "#5046e5",
        group: "style"
      },
      {
        key: "color",
        label: "Text Color",
        type: "color",
        defaultValue: "#ffffff",
        group: "style"
      },
      {
        key: "borderRadius",
        label: "Border Radius",
        type: "text",
        defaultValue: "6px",
        group: "style",
        placeholder: "e.g. 6px"
      },
      {
        key: "padding",
        label: "Padding",
        type: "text",
        defaultValue: "12px 24px",
        group: "style",
        placeholder: "e.g. 12px 24px"
      }
    ]
  },
  {
    type: "image",
    label: "Image",
    icon: "image",
    category: "content",
    description: "Image with alt text",
    defaultProps: {
      src: "https://placehold.co/600x200/e2e8f0/64748b?text=Image",
      alt: "Image",
      width: 600
    },
    acceptsChildren: false,
    properties: [
      {
        key: "src",
        label: "Source URL",
        type: "url",
        group: "content",
        placeholder: "https://..."
      },
      {
        key: "alt",
        label: "Alt Text",
        type: "text",
        group: "content",
        placeholder: "Describe the image"
      },
      {
        key: "width",
        label: "Width (px)",
        type: "number",
        group: "layout"
      },
      {
        key: "height",
        label: "Height (px)",
        type: "number",
        group: "layout"
      }
    ]
  },
  {
    type: "link",
    label: "Link",
    icon: "external-link",
    category: "content",
    description: "Hyperlink text",
    defaultProps: {
      content: "Click here",
      href: "https://example.com",
      color: "#5046e5"
    },
    acceptsChildren: false,
    properties: [
      {
        key: "content",
        label: "Text",
        type: "text",
        defaultValue: "Click here",
        group: "content"
      },
      {
        key: "href",
        label: "URL",
        type: "url",
        group: "content",
        placeholder: "https://..."
      },
      {
        key: "color",
        label: "Color",
        type: "color",
        defaultValue: "#5046e5",
        group: "style"
      }
    ]
  },
  // ─── Utility Components ────────────────────────────────────────────
  {
    type: "hr",
    label: "Divider",
    icon: "minus",
    category: "utility",
    description: "Horizontal divider line",
    defaultProps: {
      borderColor: "#e2e8f0",
      borderWidth: "1px"
    },
    acceptsChildren: false,
    properties: [
      {
        key: "borderColor",
        label: "Color",
        type: "color",
        defaultValue: "#e2e8f0",
        group: "style"
      },
      {
        key: "borderWidth",
        label: "Width",
        type: "text",
        defaultValue: "1px",
        group: "style",
        placeholder: "e.g. 1px"
      }
    ]
  },
  {
    type: "spacer",
    label: "Spacer",
    icon: "move-vertical",
    category: "utility",
    description: "Vertical space between elements",
    defaultProps: { height: "20px" },
    acceptsChildren: false,
    properties: [
      {
        key: "height",
        label: "Height",
        type: "text",
        defaultValue: "20px",
        group: "layout",
        placeholder: "e.g. 20px, 2em"
      }
    ]
  }
];
var defaultRegistry = createRegistry(defaultDefinitions);
function getComponentsByCategory(registry) {
  const result = {};
  for (const def of registry.values()) {
    if (!result[def.category]) {
      result[def.category] = [];
    }
    result[def.category].push(def);
  }
  return result;
}
function getComponentDef(registry, type) {
  return registry.get(type);
}

// src/components/component-card.tsx
import React5 from "react";
function ComponentCard({ definition, onClick, className }) {
  const Icon = getIcon(definition.icon);
  return React5.createElement(
    "button",
    {
      className: `oe-component-card ${className ?? ""}`,
      onClick: () => onClick(definition),
      title: definition.description
    },
    React5.createElement(
      "span",
      { className: "oe-component-card-icon" },
      React5.createElement(Icon, { size: 18 })
    ),
    React5.createElement(
      "span",
      { className: "oe-component-card-label" },
      definition.label
    )
  );
}

// src/components/layer-tree.tsx
import React6, { useState as useState2, useCallback as useCallback3 } from "react";
function LayerNode({ node, depth = 0 }) {
  const { selectedNodeId, selectNode } = useEditor();
  const [expanded, setExpanded] = useState2(true);
  const isSelected = selectedNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const def = defaultRegistry.get(node.type);
  const Icon = getIcon(def?.icon ?? "box");
  const handleClick = useCallback3(
    (e) => {
      e.stopPropagation();
      selectNode(node.id);
    },
    [node.id, selectNode]
  );
  const toggleExpand = useCallback3(
    (e) => {
      e.stopPropagation();
      setExpanded((prev) => !prev);
    },
    []
  );
  let label = def?.label ?? node.type;
  const content = node.props.content ?? node.props.text ?? "";
  if (content) {
    label += `: ${content.slice(0, 20)}${content.length > 20 ? "\u2026" : ""}`;
  }
  return React6.createElement(
    "li",
    { className: "oe-layer-item" },
    React6.createElement(
      "div",
      {
        className: "oe-layer-item-content",
        "data-selected": isSelected ? "true" : "false",
        onClick: handleClick,
        style: { paddingLeft: `${depth * 16 + 8}px` }
      },
      hasChildren ? React6.createElement(
        "span",
        {
          className: "oe-layer-item-icon",
          onClick: toggleExpand,
          style: { cursor: "pointer" }
        },
        expanded ? React6.createElement(Icons.chevronDown, { size: 12 }) : React6.createElement(Icons.chevronRight, { size: 12 })
      ) : React6.createElement("span", {
        className: "oe-layer-item-icon",
        style: { width: 12 }
      }),
      React6.createElement(Icon, { size: 12 }),
      React6.createElement("span", { className: "oe-layer-item-label" }, label)
    ),
    hasChildren && expanded ? React6.createElement(
      "ul",
      { className: "oe-layer-children" },
      node.children.map(
        (child) => React6.createElement(LayerNode, {
          key: child.id,
          node: child,
          depth: depth + 1
        })
      )
    ) : null
  );
}
function LayerTree({ className }) {
  const { document } = useEditor();
  return React6.createElement(
    "ul",
    { className: `oe-layer-tree ${className ?? ""}` },
    React6.createElement(LayerNode, { node: document.body })
  );
}

// src/components/editor-sidebar.tsx
function EditorSidebar({
  className,
  registry,
  defaultTab = "components"
}) {
  const [activeTab, setActiveTab] = useState3(defaultTab);
  const { selectedNodeId, document, addNode: addNode2 } = useEditor();
  const reg = registry ?? defaultRegistry;
  const grouped = getComponentsByCategory(reg);
  const handleAddComponent = useCallback4(
    (def) => {
      const newNode = createNode(
        def.type,
        { ...def.defaultProps },
        def.acceptsChildren ? [] : void 0
      );
      const parentId = selectedNodeId ?? document.body.id;
      addNode2(parentId, newNode);
    },
    [selectedNodeId, document.body.id, addNode2]
  );
  const categoryLabels = {
    layout: "Layout",
    content: "Content",
    utility: "Utility"
  };
  return React7.createElement(
    "div",
    { className: `oe-sidebar ${className ?? ""}` },
    // Tab buttons
    React7.createElement(
      "div",
      { className: "oe-sidebar-tabs" },
      React7.createElement(
        "button",
        {
          className: "oe-sidebar-tab",
          "data-active": activeTab === "components" ? "true" : "false",
          onClick: () => setActiveTab("components")
        },
        React7.createElement(Icons.plus, { size: 14 }),
        " Components"
      ),
      React7.createElement(
        "button",
        {
          className: "oe-sidebar-tab",
          "data-active": activeTab === "layers" ? "true" : "false",
          onClick: () => setActiveTab("layers")
        },
        React7.createElement(Icons.layers, { size: 14 }),
        " Layers"
      )
    ),
    // Tab content
    React7.createElement(
      "div",
      { className: "oe-sidebar-content" },
      activeTab === "components" ? (
        // Components palette
        Object.entries(grouped).map(
          ([category, defs]) => React7.createElement(
            "div",
            { key: category, className: "oe-component-category" },
            React7.createElement(
              "div",
              { className: "oe-component-category-title" },
              categoryLabels[category] ?? category
            ),
            React7.createElement(
              "div",
              { className: "oe-component-grid" },
              defs.map(
                (def) => React7.createElement(ComponentCard, {
                  key: def.type,
                  definition: def,
                  onClick: handleAddComponent
                })
              )
            )
          )
        )
      ) : (
        // Layer tree
        React7.createElement(LayerTree, null)
      )
    )
  );
}

// src/components/editor-canvas.tsx
import React8, { useCallback as useCallback5, useState as useState4, useEffect, useRef, useMemo as useMemo2 } from "react";
function CanvasNode({ node }) {
  const { selectedNodeId, selectNode } = useEditor();
  const isSelected = selectedNodeId === node.id;
  const def = defaultRegistry.get(node.type);
  const handleClick = useCallback5(
    (e) => {
      e.stopPropagation();
      selectNode(node.id);
    },
    [node.id, selectNode]
  );
  const label = def?.label ?? node.type;
  const renderContent = () => {
    const style = node.props.style ?? {};
    switch (node.type) {
      case "container":
        return React8.createElement(
          "div",
          {
            style: {
              maxWidth: node.props.maxWidth ?? "600px",
              margin: "0 auto",
              padding: "20px",
              ...style
            }
          },
          node.children?.map(
            (child) => React8.createElement(CanvasNode, { key: child.id, node: child })
          ),
          (!node.children || node.children.length === 0) && React8.createElement(
            "div",
            { className: "oe-drop-zone" },
            "+ Add component"
          )
        );
      case "section":
        return React8.createElement(
          "div",
          { style: { padding: "10px 0", ...style } },
          node.children?.map(
            (child) => React8.createElement(CanvasNode, { key: child.id, node: child })
          ),
          (!node.children || node.children.length === 0) && React8.createElement(
            "div",
            { className: "oe-drop-zone" },
            "+ Add to section"
          )
        );
      case "row":
        return React8.createElement(
          "div",
          {
            style: {
              display: "flex",
              gap: "8px",
              width: "100%",
              ...style
            }
          },
          node.children?.map(
            (child) => React8.createElement(CanvasNode, { key: child.id, node: child })
          ),
          (!node.children || node.children.length === 0) && React8.createElement(
            "div",
            { className: "oe-drop-zone", style: { flex: 1 } },
            "+ Add column"
          )
        );
      case "column":
        return React8.createElement(
          "div",
          {
            style: {
              flex: 1,
              padding: "8px",
              ...style
            }
          },
          node.children?.map(
            (child) => React8.createElement(CanvasNode, { key: child.id, node: child })
          ),
          (!node.children || node.children.length === 0) && React8.createElement(
            "div",
            { className: "oe-drop-zone" },
            "+ Add content"
          )
        );
      case "text":
        return React8.createElement(
          "p",
          {
            style: {
              margin: "0",
              padding: "4px 0",
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#374151",
              ...style
            }
          },
          node.props.content ?? ""
        );
      case "heading": {
        const Tag = node.props.as ?? "h2";
        const sizeMap = {
          h1: "32px",
          h2: "24px",
          h3: "20px",
          h4: "18px",
          h5: "16px",
          h6: "14px"
        };
        return React8.createElement(
          Tag,
          {
            style: {
              margin: "0",
              padding: "4px 0",
              fontSize: sizeMap[Tag] ?? "24px",
              fontWeight: "bold",
              color: "#111827",
              ...style
            }
          },
          node.props.content ?? ""
        );
      }
      case "button":
        return React8.createElement(
          "div",
          { style: { padding: "4px 0" } },
          React8.createElement(
            "a",
            {
              style: {
                display: "inline-block",
                padding: node.props.padding ?? "12px 24px",
                backgroundColor: node.props.backgroundColor ?? "#5046e5",
                color: node.props.color ?? "#ffffff",
                borderRadius: node.props.borderRadius ?? "6px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
                textAlign: "center",
                ...style
              },
              href: "#",
              onClick: (e) => e.preventDefault()
            },
            node.props.text ?? "Button"
          )
        );
      case "image":
        return React8.createElement("img", {
          src: node.props.src ?? "https://placehold.co/600x200/e2e8f0/64748b?text=Image",
          alt: node.props.alt ?? "",
          width: node.props.width ?? void 0,
          height: node.props.height ?? void 0,
          style: {
            maxWidth: "100%",
            height: "auto",
            display: "block",
            ...style
          }
        });
      case "link":
        return React8.createElement(
          "a",
          {
            href: "#",
            onClick: (e) => e.preventDefault(),
            style: {
              color: node.props.color ?? "#5046e5",
              textDecoration: "underline",
              fontSize: "14px",
              ...style
            }
          },
          node.props.content ?? "Link"
        );
      case "hr":
        return React8.createElement("hr", {
          style: {
            border: "none",
            borderTop: `${node.props.borderWidth ?? "1px"} solid ${node.props.borderColor ?? "#e2e8f0"}`,
            margin: "16px 0",
            ...style
          }
        });
      case "spacer":
        return React8.createElement("div", {
          style: {
            height: node.props.height ?? "20px",
            ...style
          }
        });
      default:
        return React8.createElement(
          "div",
          { style: { padding: "8px", color: "#94a3b8", fontSize: "12px" } },
          `[${node.type}]`
        );
    }
  };
  return React8.createElement(
    "div",
    {
      className: "oe-canvas-node",
      "data-selected": isSelected ? "true" : "false",
      "data-label": label,
      "data-node-id": node.id,
      onClick: handleClick
    },
    renderContent()
  );
}
function VisualCanvas() {
  const { document, selectNode } = useEditor();
  const handleCanvasClick = useCallback5(() => {
    selectNode(null);
  }, [selectNode]);
  return React8.createElement(
    "div",
    { className: "oe-canvas", onClick: handleCanvasClick },
    React8.createElement(
      "div",
      { className: "oe-canvas-inner" },
      React8.createElement(CanvasNode, { node: document.body })
    )
  );
}
function CodeCanvas() {
  const { document, setDocument } = useEditor();
  const [code, setCode] = useState4(() => exportToJSON(document));
  const [error, setError] = useState4(null);
  useEffect(() => {
    setCode(exportToJSON(document));
  }, [document]);
  const handleChange = useCallback5((e) => {
    const newCode = e.target.value;
    setCode(newCode);
    try {
      const parsed = importFromJSON(newCode);
      setDocument(parsed);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [setDocument]);
  return React8.createElement(
    "div",
    { className: "oe-code-editor" },
    error && React8.createElement(
      "div",
      {
        style: {
          padding: "8px 12px",
          background: "#fef2f2",
          color: "#dc2626",
          fontSize: "12px",
          borderBottom: "1px solid #fecaca"
        }
      },
      "\u26A0 ",
      error
    ),
    React8.createElement("textarea", {
      className: "oe-code-textarea",
      value: code,
      onChange: handleChange,
      spellCheck: false
    })
  );
}
function PreviewCanvas() {
  const { document } = useEditor();
  const [html, setHtml] = useState4("");
  const iframeRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    renderToHTML(document).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [document]);
  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);
  return React8.createElement(
    "div",
    { className: "oe-preview" },
    React8.createElement("iframe", {
      ref: iframeRef,
      className: "oe-preview-iframe",
      title: "Email Preview",
      sandbox: "allow-same-origin"
    })
  );
}
function EditorCanvas({ className }) {
  const { mode } = useEditor();
  const content = useMemo2(() => {
    switch (mode) {
      case "visual":
        return React8.createElement(VisualCanvas, null);
      case "code":
        return React8.createElement(CodeCanvas, null);
      case "preview":
        return React8.createElement(PreviewCanvas, null);
      default:
        return React8.createElement(VisualCanvas, null);
    }
  }, [mode]);
  return content;
}

// src/components/properties-panel.tsx
import React9, { useCallback as useCallback6, useMemo as useMemo3 } from "react";
function PropertyField({ schema, value, onChange }) {
  const handleChange = useCallback6(
    (e) => {
      let newValue = e.target.value;
      if (schema.type === "number") {
        newValue = e.target.value === "" ? void 0 : Number(e.target.value);
      } else if (schema.type === "toggle") {
        newValue = e.target.checked;
      }
      onChange(schema.key, newValue);
    },
    [schema.key, schema.type, onChange]
  );
  const stringValue = value !== void 0 && value !== null ? String(value) : "";
  switch (schema.type) {
    case "textarea":
      return React9.createElement(
        "div",
        { className: "oe-field" },
        React9.createElement("label", { className: "oe-field-label" }, schema.label),
        React9.createElement("textarea", {
          className: "oe-field-textarea",
          value: stringValue,
          onChange: handleChange,
          placeholder: schema.placeholder ?? ""
        })
      );
    case "select":
      return React9.createElement(
        "div",
        { className: "oe-field" },
        React9.createElement("label", { className: "oe-field-label" }, schema.label),
        React9.createElement(
          "select",
          {
            className: "oe-field-select",
            value: stringValue,
            onChange: handleChange
          },
          React9.createElement("option", { value: "" }, "\u2014"),
          ...(schema.options ?? []).map(
            (opt) => React9.createElement(
              "option",
              { key: opt.value, value: opt.value },
              opt.label
            )
          )
        )
      );
    case "color":
      return React9.createElement(
        "div",
        { className: "oe-field" },
        React9.createElement("label", { className: "oe-field-label" }, schema.label),
        React9.createElement(
          "div",
          { className: "oe-field-color-wrapper" },
          React9.createElement("input", {
            type: "color",
            className: "oe-field-color-swatch",
            value: stringValue || "#000000",
            onChange: handleChange
          }),
          React9.createElement("input", {
            type: "text",
            className: "oe-field-input",
            value: stringValue,
            onChange: handleChange,
            placeholder: "#000000",
            style: { flex: 1 }
          })
        )
      );
    case "toggle":
      return React9.createElement(
        "div",
        { className: "oe-field" },
        React9.createElement(
          "label",
          {
            className: "oe-field-label",
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer"
            }
          },
          React9.createElement("input", {
            type: "checkbox",
            checked: !!value,
            onChange: handleChange
          }),
          schema.label
        )
      );
    case "number":
      return React9.createElement(
        "div",
        { className: "oe-field" },
        React9.createElement("label", { className: "oe-field-label" }, schema.label),
        React9.createElement("input", {
          type: "number",
          className: "oe-field-input",
          value: stringValue,
          onChange: handleChange,
          placeholder: schema.placeholder ?? ""
        })
      );
    case "url":
    case "text":
    case "spacing":
    default:
      return React9.createElement(
        "div",
        { className: "oe-field" },
        React9.createElement("label", { className: "oe-field-label" }, schema.label),
        React9.createElement("input", {
          type: schema.type === "url" ? "url" : "text",
          className: "oe-field-input",
          value: stringValue,
          onChange: handleChange,
          placeholder: schema.placeholder ?? ""
        })
      );
  }
}
function resolveValue(props, key) {
  if (key.includes(".")) {
    const parts = key.split(".");
    let current = props;
    for (const part of parts) {
      if (current && typeof current === "object") {
        current = current[part];
      } else {
        return void 0;
      }
    }
    return current;
  }
  return props[key];
}
function PropertiesPanel({ className, registry }) {
  const { selectedNodeId, updateNode: updateNode2, deleteNode } = useEditor();
  const selectedNode = useSelectedNode();
  const reg = registry ?? defaultRegistry;
  const definition = useMemo3(
    () => selectedNode ? reg.get(selectedNode.type) : void 0,
    [selectedNode, reg]
  );
  const handlePropertyChange = useCallback6(
    (key, value) => {
      if (!selectedNodeId) return;
      if (key.includes(".")) {
        const parts = key.split(".");
        if (parts.length === 2) {
          const [parent, child] = parts;
          updateNode2(selectedNodeId, {
            [parent]: {
              ...resolveValue(selectedNode?.props ?? {}, parent) ?? {},
              [child]: value === "" ? void 0 : value
            }
          });
          return;
        }
      }
      updateNode2(selectedNodeId, { [key]: value === "" ? void 0 : value });
    },
    [selectedNodeId, selectedNode, updateNode2]
  );
  const handleDelete = useCallback6(() => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
    }
  }, [selectedNodeId, deleteNode]);
  if (!selectedNode || !definition) {
    return React9.createElement(
      "div",
      { className: `oe-properties ${className ?? ""}` },
      React9.createElement(
        "div",
        { className: "oe-properties-empty" },
        React9.createElement(Icons.settings, { size: 32 }),
        React9.createElement("p", null, "Select an element to edit its properties")
      )
    );
  }
  const groups = {};
  for (const prop of definition.properties) {
    const group = prop.group ?? "content";
    if (!groups[group]) groups[group] = [];
    groups[group].push(prop);
  }
  const groupLabels = {
    content: "Content",
    layout: "Layout",
    style: "Style"
  };
  const groupOrder = ["content", "layout", "style"];
  return React9.createElement(
    "div",
    { className: `oe-properties ${className ?? ""}` },
    // Header
    React9.createElement(
      "div",
      { className: "oe-properties-header" },
      React9.createElement(
        "span",
        { className: "oe-properties-title" },
        definition.label
      ),
      React9.createElement(
        "button",
        {
          className: "oe-btn-icon",
          onClick: handleDelete,
          title: "Delete element",
          style: { color: "var(--oe-danger)" }
        },
        React9.createElement(Icons.trash, { size: 16 })
      )
    ),
    ...groupOrder.filter((g) => groups[g] && groups[g].length > 0).map(
      (group) => React9.createElement(
        "div",
        { key: group, className: "oe-properties-group" },
        React9.createElement(
          "div",
          { className: "oe-properties-group-title" },
          groupLabels[group] ?? group
        ),
        ...groups[group].map(
          (prop) => React9.createElement(PropertyField, {
            key: prop.key,
            schema: prop,
            value: resolveValue(selectedNode.props, prop.key),
            onChange: handlePropertyChange
          })
        )
      )
    )
  );
}

// src/components/email-editor.tsx
function EmailEditor({
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
  onExportJSON
}) {
  const {
    showSidebar = true,
    showToolbar = true,
    showProperties = true,
    showExportJSON = true,
    showExportHTML = true,
    theme = "light",
    availableModes,
    registry
  } = config;
  return React10.createElement(
    EditorProvider,
    { initialDocument, onChange },
    React10.createElement(
      "div",
      {
        className: `open-email-editor ${className ?? ""}`,
        "data-theme": theme,
        style
      },
      // Toolbar
      showToolbar && toolbar !== false && (toolbar ?? React10.createElement(EditorToolbar, {
        modes: availableModes,
        actions: toolbarActions,
        showExportJSON,
        showExportHTML,
        components,
        onExportHTML,
        onExportJSON
      })),
      // Body (sidebar + canvas + properties)
      React10.createElement(
        "div",
        { className: "oe-editor-body" },
        // Sidebar
        showSidebar && sidebar !== false && (sidebar ?? React10.createElement(EditorSidebar, { registry })),
        // Canvas
        canvas ?? React10.createElement(EditorCanvas, null),
        // Properties Panel
        showProperties && propertiesPanel !== false && (propertiesPanel ?? React10.createElement(PropertiesPanel, { registry }))
      )
    )
  );
}
export {
  ComponentCard,
  EditorCanvas,
  EditorProvider,
  EditorSidebar,
  EditorToolbar,
  EmailEditor,
  Icons,
  LayerTree,
  PropertiesPanel,
  addNode,
  cloneNode,
  createEmptyDocument,
  createNode,
  createRegistry,
  defaultRegistry,
  exportToJSON,
  findNode,
  findParent,
  flattenTree,
  generateId,
  getComponentDef,
  getComponentsByCategory,
  getIcon,
  getNodePath,
  importFromJSON,
  mergeRegistries,
  moveNode,
  removeNode,
  renderToHTML,
  renderToPlainText,
  renderToReactEmail,
  updateNode,
  useEditor,
  useNode,
  useSelectedNode,
  validateDocument
};
//# sourceMappingURL=index.mjs.map