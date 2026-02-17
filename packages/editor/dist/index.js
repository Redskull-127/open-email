"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ComponentCard: () => ComponentCard,
  DragDropProvider: () => DragDropProvider,
  EditorCanvas: () => EditorCanvas,
  EditorProvider: () => EditorProvider,
  EditorSidebar: () => EditorSidebar,
  EditorToolbar: () => EditorToolbar,
  EmailEditor: () => EmailEditor,
  Icons: () => Icons,
  LayerTree: () => LayerTree,
  PropertiesPanel: () => PropertiesPanel,
  VariableManager: () => VariableManager,
  addNode: () => addNode,
  cloneNode: () => cloneNode,
  createEmptyDocument: () => createEmptyDocument,
  createNode: () => createNode,
  createRegistry: () => createRegistry,
  defaultRegistry: () => defaultRegistry,
  exportToJSON: () => exportToJSON,
  extractVariableNames: () => extractVariableNames,
  findNode: () => findNode,
  findParent: () => findParent,
  flattenTree: () => flattenTree,
  generateId: () => generateId,
  getComponentDef: () => getComponentDef,
  getComponentsByCategory: () => getComponentsByCategory,
  getIcon: () => getIcon,
  getNodePath: () => getNodePath,
  hasVariables: () => hasVariables,
  importFromJSON: () => importFromJSON,
  interpolateVariables: () => interpolateVariables,
  mergeRegistries: () => mergeRegistries,
  moveNode: () => moveNode,
  removeNode: () => removeNode,
  renderToHTML: () => renderToHTML,
  renderToPlainText: () => renderToPlainText,
  renderToReactEmail: () => renderToReactEmail,
  updateNode: () => updateNode,
  useContainerDropZone: () => useContainerDropZone,
  useDragDrop: () => useDragDrop,
  useDropZone: () => useDropZone,
  useEditor: () => useEditor,
  useNode: () => useNode,
  useNodeDraggable: () => useNodeDraggable,
  useNodeDroppable: () => useNodeDroppable,
  useSelectedNode: () => useSelectedNode,
  useSidebarDraggable: () => useSidebarDraggable,
  useVariables: () => useVariables,
  validateDocument: () => validateDocument
});
module.exports = __toCommonJS(index_exports);

// src/components/email-editor.tsx
var import_react17 = __toESM(require("react"));

// src/engine/editor-store.ts
var import_react = __toESM(require("react"));

// src/engine/operations.ts
var import_nanoid = require("nanoid");
function generateId() {
  return (0, import_nanoid.nanoid)(10);
}
function createNode(type, props = {}, children, id) {
  return {
    id: id || generateId(),
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
    case "UPDATE_VARIABLES":
      return {
        ...state,
        document: {
          ...state.document,
          variables: action.payload
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
var EditorContext = (0, import_react.createContext)(null);
var DIRTY_ACTIONS = /* @__PURE__ */ new Set(["UPDATE_NODE", "ADD_NODE", "DELETE_NODE", "MOVE_NODE", "UPDATE_VARIABLES"]);
function EditorProvider({
  initialDocument,
  onChange,
  children
}) {
  const [state, dispatch] = (0, import_react.useReducer)(editorReducer, {
    document: initialDocument ?? createEmptyDocument(),
    selectedNodeId: null,
    mode: "visual",
    isDirty: false
  });
  const stateRef = (0, import_react.useRef)(state);
  (0, import_react.useEffect)(() => {
    stateRef.current = state;
  }, [state]);
  const wrappedDispatch = (0, import_react.useCallback)(
    (action) => {
      dispatch(action);
      if (onChange && DIRTY_ACTIONS.has(action.type)) {
        const newState = editorReducer(stateRef.current, action);
        onChange(newState.document);
      }
    },
    [onChange]
  );
  const value = (0, import_react.useMemo)(
    () => ({ state, dispatch: wrappedDispatch }),
    [state, wrappedDispatch]
  );
  return import_react.default.createElement(EditorContext.Provider, { value }, children);
}
function useEditor() {
  const ctx = (0, import_react.useContext)(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used within an <EditorProvider>");
  }
  const { state, dispatch } = ctx;
  const actions = (0, import_react.useMemo)(
    () => ({
      setDocument: (doc) => dispatch({ type: "SET_DOCUMENT", payload: doc }),
      selectNode: (id) => dispatch({ type: "SELECT_NODE", payload: id }),
      updateNode: (id, props) => dispatch({ type: "UPDATE_NODE", payload: { id, props } }),
      addNode: (parentId, node, index) => dispatch({ type: "ADD_NODE", payload: { parentId, node, index } }),
      deleteNode: (id) => dispatch({ type: "DELETE_NODE", payload: id }),
      moveNode: (nodeId, newParentId, index) => dispatch({ type: "MOVE_NODE", payload: { nodeId, newParentId, index } }),
      updateVariables: (variables) => dispatch({ type: "UPDATE_VARIABLES", payload: variables }),
      setMode: (mode) => dispatch({ type: "SET_MODE", payload: mode }),
      markClean: () => dispatch({ type: "MARK_CLEAN" })
    }),
    [dispatch]
  );
  return { ...state, ...actions, dispatch };
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
function useVariables() {
  const { document } = useEditor();
  return document.variables ?? {};
}

// src/components/dnd/drag-drop-provider.tsx
var import_react2 = __toESM(require("react"));
var import_core = require("@dnd-kit/core");

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
      },
      {
        key: "style.height",
        label: "Height",
        type: "text",
        group: "layout",
        placeholder: "e.g. 50px"
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px"
      },
      {
        key: "style.margin",
        label: "Margin",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px"
      },
      {
        key: "style.gap",
        label: "Gap",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px (simulated)"
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
        key: "style.height",
        label: "Height",
        type: "text",
        group: "layout",
        placeholder: "e.g. 50px"
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
      },
      {
        key: "style.margin",
        label: "Margin",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px"
      },
      {
        key: "style.backgroundColor",
        label: "Background",
        type: "color",
        group: "style"
      },
      {
        key: "style.borderWidth",
        label: "Border Width",
        type: "text",
        group: "style",
        placeholder: "e.g. 1px"
      },
      {
        key: "style.borderColor",
        label: "Border Color",
        type: "color",
        group: "style"
      },
      {
        key: "style.borderRadius",
        label: "Border Radius",
        type: "text",
        group: "style",
        placeholder: "e.g. 4px"
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

// src/components/dnd/drag-drop-provider.tsx
var DragDropCtx = (0, import_react2.createContext)({
  activeId: null,
  activeData: null,
  overId: null
});
function useDragDrop() {
  return (0, import_react2.useContext)(DragDropCtx);
}
var collisionDetection = (args) => {
  const pointerResult = (0, import_core.pointerWithin)(args);
  if (pointerResult.length > 0) return pointerResult;
  return (0, import_core.rectIntersection)(args);
};
function DragDropProvider({ children }) {
  const { addNode: addNode2, moveNode: moveNode2 } = useEditor();
  const [activeId, setActiveId] = (0, import_react2.useState)(null);
  const [activeData, setActiveData] = (0, import_react2.useState)(null);
  const [overId, setOverId] = (0, import_react2.useState)(null);
  const sensors = (0, import_core.useSensors)(
    (0, import_core.useSensor)(import_core.MouseSensor, { activationConstraint: { distance: 8 } }),
    (0, import_core.useSensor)(import_core.TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );
  const handleDragStart = (0, import_react2.useCallback)((e) => {
    const data = e.active.data.current;
    setActiveId(String(e.active.id));
    setActiveData(data ?? null);
  }, []);
  const handleDragOver = (0, import_react2.useCallback)((e) => {
    setOverId(e.over ? String(e.over.id) : null);
  }, []);
  const handleDragEnd = (0, import_react2.useCallback)(
    (e) => {
      const { active, over } = e;
      const data = active.data.current;
      const dropData = over?.data.current;
      setActiveId(null);
      setActiveData(null);
      setOverId(null);
      if (!over || !data || !dropData) return;
      if (data.origin === "sidebar") {
        const def = defaultRegistry.get(data.componentType);
        if (!def) return;
        const newNode = createNode(
          def.type,
          { ...def.defaultProps },
          def.acceptsChildren ? [] : void 0
        );
        addNode2(dropData.parentId, newNode, dropData.index);
        return;
      }
      if (data.origin === "canvas" || data.origin === "layers") {
        const fromParent = data.parentId;
        const fromIndex = data.index;
        const toParent = dropData.parentId;
        const toIndex = dropData.index;
        if (fromParent === toParent && fromIndex === toIndex) return;
        let adjustedIndex = toIndex;
        if (fromParent === toParent && fromIndex < toIndex) {
          adjustedIndex = toIndex - 1;
        }
        moveNode2(data.nodeId, toParent, adjustedIndex);
      }
    },
    [addNode2, moveNode2]
  );
  const handleDragCancel = (0, import_react2.useCallback)(() => {
    setActiveId(null);
    setActiveData(null);
    setOverId(null);
  }, []);
  const ctxValue = (0, import_react2.useMemo)(
    () => ({ activeId, activeData, overId }),
    [activeId, activeData, overId]
  );
  const dndId = import_react2.default.useId();
  return import_react2.default.createElement(
    import_core.DndContext,
    {
      id: dndId,
      sensors,
      collisionDetection,
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel
    },
    import_react2.default.createElement(
      DragDropCtx.Provider,
      { value: ctxValue },
      children
    ),
    // Drag overlay ghost
    import_react2.default.createElement(
      import_core.DragOverlay,
      { dropAnimation: null },
      activeData ? import_react2.default.createElement(
        "div",
        { className: "oe-drag-overlay" },
        activeData.label
      ) : null
    )
  );
}

// src/components/editor-toolbar.tsx
var import_react5 = __toESM(require("react"));

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
var import_render = require("@react-email/render");

// src/renderer/react-email-renderer.ts
var import_react3 = __toESM(require("react"));

// src/utils/variable-interpolation.ts
var VARIABLE_PATTERN = /\{\{(\w+)\}\}/g;
function interpolateVariables(content, variableData, variableDefinitions) {
  if (typeof content !== "string") return "";
  const defs = variableDefinitions ?? {};
  const data = variableData ?? {};
  return content.replace(VARIABLE_PATTERN, (_, key) => {
    if (data[key] !== void 0 && data[key] !== "") return data[key];
    return defs[key]?.fallback ?? "";
  });
}
function hasVariables(content) {
  return typeof content === "string" && VARIABLE_PATTERN.test(content);
}
function extractVariableNames(content) {
  if (typeof content !== "string") return [];
  const names = /* @__PURE__ */ new Set();
  let match;
  const re = new RegExp(VARIABLE_PATTERN);
  while ((match = re.exec(content)) !== null) {
    names.add(match[1]);
  }
  return Array.from(names);
}

// src/renderer/react-email-renderer.ts
var import_components = require("@react-email/components");
var componentMap = {
  container: import_components.Container,
  section: import_components.Section,
  row: import_components.Row,
  column: import_components.Column,
  text: import_components.Text,
  heading: import_components.Heading,
  button: import_components.Button,
  image: import_components.Img,
  link: import_components.Link,
  hr: import_components.Hr
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
function interpolate(ctx, value) {
  if (value == null) return "";
  return interpolateVariables(value, ctx.variableData, ctx.variableDefinitions);
}
function renderNode(node, ctx) {
  if (node.type === "spacer") {
    const resolvedProps2 = resolveProps(node.props);
    const h = resolvedProps2.height ?? "20px";
    return import_react3.default.createElement(
      import_components.Section,
      { key: node.id },
      import_react3.default.createElement("div", {
        style: { height: h, lineHeight: h, fontSize: "1px" }
      }, "\xA0")
    );
  }
  const Component = componentMap[node.type];
  if (!Component) {
    return import_react3.default.createElement(
      "div",
      { key: node.id, "data-unknown-type": node.type },
      node.children?.map((c) => renderNode(c, ctx))
    );
  }
  const resolvedProps = resolveProps(node.props);
  const { content, text, ...restProps } = resolvedProps;
  if (node.type === "text" || node.type === "heading" || node.type === "link") {
    return import_react3.default.createElement(
      Component,
      { key: node.id, ...restProps },
      interpolate(ctx, content)
    );
  }
  if (node.type === "button") {
    return import_react3.default.createElement(
      Component,
      { key: node.id, ...restProps },
      interpolate(ctx, text)
    );
  }
  if (!node.children || node.children.length === 0) {
    return import_react3.default.createElement(Component, { key: node.id, ...resolvedProps });
  }
  if (node.type === "column") {
    const { style, ...otherProps } = resolvedProps;
    const { verticalAlign, width, height, ...otherStyle } = style || {};
    return import_react3.default.createElement(
      Component,
      {
        key: node.id,
        ...otherProps,
        style: { ...otherStyle, verticalAlign },
        width,
        height
      },
      node.children.map((c) => renderNode(c, ctx))
    );
  }
  if (node.type === "row") {
    const { style, ...otherProps } = resolvedProps;
    const gap = style?.gap;
    let children = node.children.map((c) => renderNode(c, ctx));
    if (gap) {
      const gapValue = parseInt(gap.replace("px", ""), 10);
      if (!isNaN(gapValue) && gapValue > 0) {
        const newChildren = [];
        children.forEach((child, index) => {
          newChildren.push(child);
          if (index < children.length - 1) {
            newChildren.push(
              import_react3.default.createElement("td", {
                key: `spacer-${index}`,
                width: gapValue,
                style: { fontSize: 0, lineHeight: 0 }
              }, "\xA0")
            );
          }
        });
        children = newChildren;
      }
    }
    return import_react3.default.createElement(
      Component,
      {
        key: node.id,
        ...otherProps,
        style: { ...style, gap: void 0 }
      },
      children
    );
  }
  return import_react3.default.createElement(
    Component,
    { key: node.id, ...resolvedProps },
    node.children.map((c) => renderNode(c, ctx))
  );
}
function renderToReactEmail(document, variableData) {
  const ctx = {
    variableData,
    variableDefinitions: document.variables
  };
  const bodyContent = renderNode(document.body, ctx);
  return import_react3.default.createElement(
    import_components.Html,
    { lang: "en", dir: "ltr" },
    import_react3.default.createElement(import_components.Head, null),
    document.meta.previewText ? import_react3.default.createElement(import_components.Preview, null, document.meta.previewText) : null,
    import_react3.default.createElement(
      import_components.Body,
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
async function renderToHTML(document, variableData) {
  const element = renderToReactEmail(document, variableData);
  const html = await (0, import_render.render)(element);
  return html;
}
async function renderToPlainText(document, variableData) {
  const element = renderToReactEmail(document, variableData);
  const text = await (0, import_render.render)(element, { plainText: true });
  return text;
}

// src/components/icons.tsx
var import_react4 = __toESM(require("react"));
function icon(paths, viewBox = "0 0 24 24") {
  return function Icon({ size = 16, className }) {
    return import_react4.default.createElement("svg", {
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
  copy: icon('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>'),
  check: icon('<polyline points="20 6 9 17 4 12"/>'),
  close: icon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')
};
function getIcon(name) {
  return Icons[name] ?? Icons.box;
}

// src/components/editor-toolbar.tsx
function EditorToolbar({
  className,
  modes = ["visual", "code", "preview"],
  actions,
  variableData,
  onExportHTML,
  onExportJSON,
  showExportJSON = true,
  showExportHTML = true,
  components = {}
}) {
  const { mode, setMode, document } = useEditor();
  const [exporting, setExporting] = (0, import_react5.useState)(false);
  const modeLabels = (0, import_react5.useMemo)(
    () => ({
      visual: { label: "Visual", Icon: Icons.eye },
      code: { label: "Code", Icon: Icons.code },
      preview: { label: "Preview", Icon: Icons.monitor }
    }),
    []
  );
  const handleExportHTML = (0, import_react5.useCallback)(async () => {
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
  const handleExportJSON = (0, import_react5.useCallback)(() => {
    const json = exportToJSON(document);
    if (onExportJSON) {
      onExportJSON(json);
    } else {
      navigator.clipboard.writeText(json);
    }
  }, [document, onExportJSON]);
  const { ExportJSONButton, ExportHTMLButton } = components;
  return import_react5.default.createElement(
    "div",
    { className: `oe-toolbar ${className ?? ""}` },
    import_react5.default.createElement(
      "div",
      { className: "oe-toolbar-section" },
      import_react5.default.createElement(
        "div",
        { className: "oe-mode-switcher" },
        ...modes.map((m) => {
          const { label, Icon } = modeLabels[m];
          return import_react5.default.createElement(
            "button",
            {
              key: m,
              className: "oe-mode-btn",
              "data-active": mode === m ? "true" : "false",
              onClick: () => setMode(m),
              title: `${label} mode`
            },
            import_react5.default.createElement(Icon, { size: 14 }),
            ` ${label}`
          );
        })
      )
    ),
    import_react5.default.createElement(
      "div",
      { className: "oe-toolbar-section" },
      actions,
      showExportJSON && (ExportJSONButton ? import_react5.default.createElement(ExportJSONButton, { onClick: handleExportJSON }) : import_react5.default.createElement(
        "button",
        {
          className: "oe-btn",
          onClick: handleExportJSON,
          title: "Export JSON to clipboard"
        },
        import_react5.default.createElement(Icons.copy, { size: 14 }),
        "JSON"
      )),
      showExportHTML && (ExportHTMLButton ? import_react5.default.createElement(ExportHTMLButton, {
        onClick: handleExportHTML,
        loading: exporting
      }) : import_react5.default.createElement(
        "button",
        {
          className: "oe-btn oe-btn-primary",
          onClick: handleExportHTML,
          disabled: exporting,
          title: "Export HTML to clipboard"
        },
        import_react5.default.createElement(Icons.download, { size: 14 }),
        exporting ? "Exporting\u2026" : "Export HTML"
      ))
    )
  );
}

// src/components/editor-sidebar.tsx
var import_react9 = __toESM(require("react"));

// src/components/component-card.tsx
var import_react7 = __toESM(require("react"));

// src/components/dnd/dnd-hooks.tsx
var import_react6 = require("react");
var import_core2 = require("@dnd-kit/core");
function useSidebarDraggable(componentType, label) {
  const data = (0, import_react6.useMemo)(
    () => ({ origin: "sidebar", componentType, label }),
    [componentType, label]
  );
  return (0, import_core2.useDraggable)({
    id: `sidebar-${componentType}`,
    data
  });
}
function useNodeDraggable(nodeId, parentId, index, label, origin) {
  const data = (0, import_react6.useMemo)(
    () => ({ origin, nodeId, parentId, index, label }),
    [origin, nodeId, parentId, index, label]
  );
  return (0, import_core2.useDraggable)({
    id: `${origin}-${nodeId}`,
    data
  });
}
function useDropZone(parentId, index) {
  const data = (0, import_react6.useMemo)(
    () => ({ parentId, index }),
    [parentId, index]
  );
  return (0, import_core2.useDroppable)({
    id: `dropzone-${parentId}-${index}`,
    data
  });
}
function useContainerDropZone(containerId) {
  const data = (0, import_react6.useMemo)(
    () => ({ parentId: containerId, index: 0 }),
    [containerId]
  );
  return (0, import_core2.useDroppable)({
    id: `container-${containerId}`,
    data
  });
}
function useNodeDroppable(nodeId, parentId, index, acceptsChildren) {
  const data = (0, import_react6.useMemo)(
    () => acceptsChildren ? { parentId: nodeId, index: 0 } : { parentId, index: index + 1 },
    // drop after this node
    [acceptsChildren, nodeId, parentId, index]
  );
  return (0, import_core2.useDroppable)({
    id: `node-drop-${nodeId}`,
    data
  });
}

// src/components/component-card.tsx
function ComponentCard({ definition, onClick, className }) {
  const Icon = getIcon(definition.icon);
  const { attributes, listeners, setNodeRef, isDragging } = useSidebarDraggable(
    definition.type,
    definition.label
  );
  return import_react7.default.createElement(
    "button",
    {
      ref: setNodeRef,
      className: `oe-component-card ${isDragging ? "oe-dragging" : ""} ${className ?? ""}`,
      onClick: () => onClick(definition),
      title: definition.description,
      ...listeners,
      ...attributes
    },
    import_react7.default.createElement(
      "span",
      { className: "oe-component-card-icon" },
      import_react7.default.createElement(Icon, { size: 18 })
    ),
    import_react7.default.createElement(
      "span",
      { className: "oe-component-card-label" },
      definition.label
    )
  );
}

// src/components/layer-tree.tsx
var import_react8 = __toESM(require("react"));
function LayerDropIndicator({ parentId, index, depth }) {
  const { setNodeRef, isOver } = useDropZone(parentId, index);
  return import_react8.default.createElement("li", {
    ref: setNodeRef,
    className: `oe-layer-drop-indicator ${isOver ? "oe-layer-drop-indicator-active" : ""}`,
    style: { paddingLeft: `${depth * 16 + 8}px` }
  });
}
function LayerNode({ node, parentId, index, depth = 0 }) {
  const { selectedNodeId, selectNode } = useEditor();
  const [expanded, setExpanded] = (0, import_react8.useState)(true);
  const isSelected = selectedNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const def = defaultRegistry.get(node.type);
  const Icon = getIcon(def?.icon ?? "box");
  const label = def?.label ?? node.type;
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging
  } = useNodeDraggable(node.id, parentId, index, label, "layers");
  const handleClick = (0, import_react8.useCallback)(
    (e) => {
      e.stopPropagation();
      selectNode(node.id);
    },
    [node.id, selectNode]
  );
  const toggleExpand = (0, import_react8.useCallback)(
    (e) => {
      e.stopPropagation();
      setExpanded((prev) => !prev);
    },
    []
  );
  let displayLabel = label;
  const content = node.props.content ?? node.props.text ?? "";
  if (content) {
    displayLabel += `: ${content.slice(0, 20)}${content.length > 20 ? "\u2026" : ""}`;
  }
  const childElements = [];
  if (hasChildren && expanded) {
    childElements.push(
      import_react8.default.createElement(LayerDropIndicator, {
        key: `ldrop-${node.id}-0`,
        parentId: node.id,
        index: 0,
        depth: depth + 1
      })
    );
    node.children.forEach((child, i) => {
      childElements.push(
        import_react8.default.createElement(LayerNode, {
          key: child.id,
          node: child,
          parentId: node.id,
          index: i,
          depth: depth + 1
        })
      );
      childElements.push(
        import_react8.default.createElement(LayerDropIndicator, {
          key: `ldrop-${node.id}-${i + 1}`,
          parentId: node.id,
          index: i + 1,
          depth: depth + 1
        })
      );
    });
  }
  return import_react8.default.createElement(
    "li",
    {
      ref: setDragRef,
      className: `oe-layer-item ${isDragging ? "oe-dragging" : ""}`,
      ...attributes
    },
    import_react8.default.createElement(
      "div",
      {
        className: "oe-layer-item-content",
        "data-selected": isSelected ? "true" : "false",
        onClick: handleClick,
        style: { paddingLeft: `${depth * 16 + 8}px` },
        ...listeners
      },
      hasChildren ? import_react8.default.createElement(
        "span",
        {
          className: "oe-layer-item-icon",
          onClick: toggleExpand,
          style: { cursor: "pointer" }
        },
        expanded ? import_react8.default.createElement(Icons.chevronDown, { size: 12 }) : import_react8.default.createElement(Icons.chevronRight, { size: 12 })
      ) : import_react8.default.createElement("span", {
        className: "oe-layer-item-icon",
        style: { width: 12 }
      }),
      import_react8.default.createElement(Icon, { size: 12 }),
      import_react8.default.createElement("span", { className: "oe-layer-item-label" }, displayLabel)
    ),
    childElements.length > 0 ? import_react8.default.createElement("ul", { className: "oe-layer-children" }, ...childElements) : null
  );
}
function LayerTree({ className }) {
  const { document } = useEditor();
  return import_react8.default.createElement(
    "ul",
    { className: `oe-layer-tree ${className ?? ""}` },
    import_react8.default.createElement(LayerNode, {
      node: document.body,
      parentId: "__root__",
      index: 0
    })
  );
}

// src/components/editor-sidebar.tsx
function EditorSidebar({
  className,
  registry,
  defaultTab = "components"
}) {
  const [activeTab, setActiveTab] = (0, import_react9.useState)(defaultTab);
  const { selectedNodeId, document, addNode: addNode2 } = useEditor();
  const reg = registry ?? defaultRegistry;
  const grouped = getComponentsByCategory(reg);
  const handleAddComponent = (0, import_react9.useCallback)(
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
  return import_react9.default.createElement(
    "div",
    { className: `oe-sidebar ${className ?? ""}` },
    // Tab buttons
    import_react9.default.createElement(
      "div",
      { className: "oe-sidebar-tabs" },
      import_react9.default.createElement(
        "button",
        {
          className: "oe-sidebar-tab",
          "data-active": activeTab === "components" ? "true" : "false",
          onClick: () => setActiveTab("components")
        },
        import_react9.default.createElement(Icons.plus, { size: 14 }),
        " Components"
      ),
      import_react9.default.createElement(
        "button",
        {
          className: "oe-sidebar-tab",
          "data-active": activeTab === "layers" ? "true" : "false",
          onClick: () => setActiveTab("layers")
        },
        import_react9.default.createElement(Icons.layers, { size: 14 }),
        " Layers"
      )
    ),
    // Tab content
    import_react9.default.createElement(
      "div",
      { className: "oe-sidebar-content" },
      activeTab === "components" ? (
        // Components palette
        Object.entries(grouped).map(
          ([category, defs]) => import_react9.default.createElement(
            "div",
            { key: category, className: "oe-component-category" },
            import_react9.default.createElement(
              "div",
              { className: "oe-component-category-title" },
              categoryLabels[category] ?? category
            ),
            import_react9.default.createElement(
              "div",
              { className: "oe-component-grid" },
              defs.map(
                (def) => import_react9.default.createElement(ComponentCard, {
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
        import_react9.default.createElement(LayerTree, null)
      )
    )
  );
}

// src/components/editor-canvas.tsx
var import_react10 = __toESM(require("react"));
function DropIndicator({ parentId, index }) {
  const { setNodeRef, isOver } = useDropZone(parentId, index);
  return import_react10.default.createElement("div", {
    ref: setNodeRef,
    className: `oe-drop-indicator ${isOver ? "oe-drop-indicator-active" : ""}`
  });
}
function EmptyContainerDropZone({ containerId, label }) {
  const { setNodeRef, isOver } = useContainerDropZone(containerId);
  return import_react10.default.createElement("div", {
    ref: setNodeRef,
    className: `oe-drop-zone ${isOver ? "oe-drop-zone-active" : ""}`
  }, label ?? "+ Drop component here");
}
function CanvasNode({ node, parentId, index }) {
  const { selectedNodeId, selectNode } = useEditor();
  const { activeData } = useDragDrop();
  const isSelected = selectedNodeId === node.id;
  const def = defaultRegistry.get(node.type);
  const label = def?.label ?? node.type;
  const hasChildren = node.children && node.children.length > 0;
  const acceptsChildren = def?.acceptsChildren ?? false;
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging
  } = useNodeDraggable(node.id, parentId, index, label, "canvas");
  const {
    setNodeRef: setDropRef,
    isOver
  } = useNodeDroppable(node.id, parentId, index, acceptsChildren);
  const mergedRef = (0, import_react10.useCallback)(
    (el) => {
      setDragRef(el);
      setDropRef(el);
    },
    [setDragRef, setDropRef]
  );
  const renderChildren = () => {
    if (!acceptsChildren) return null;
    if (!hasChildren) {
      return import_react10.default.createElement(EmptyContainerDropZone, {
        containerId: node.id,
        label: getEmptyLabel(node.type)
      });
    }
    const children = node.children;
    const elements = [
      import_react10.default.createElement(DropIndicator, {
        key: `drop-${node.id}-0`,
        parentId: node.id,
        index: 0
      })
    ];
    for (let i = 0; i < children.length; i++) {
      elements.push(
        import_react10.default.createElement(CanvasNode, {
          key: children[i].id,
          node: children[i],
          parentId: node.id,
          index: i
        }),
        import_react10.default.createElement(DropIndicator, {
          key: `drop-${node.id}-${i + 1}`,
          parentId: node.id,
          index: i + 1
        })
      );
    }
    return elements;
  };
  const renderContent = () => {
    const style = node.props.style ?? {};
    switch (node.type) {
      case "container":
        return import_react10.default.createElement(
          "div",
          {
            style: {
              maxWidth: node.props.maxWidth ?? "600px",
              margin: "0 auto",
              padding: "20px",
              ...style
            }
          },
          renderChildren()
        );
      case "section":
        return import_react10.default.createElement(
          "div",
          { style: { padding: "10px 0", ...style } },
          renderChildren()
        );
      case "row":
        return import_react10.default.createElement(
          "div",
          {
            style: {
              display: "flex",
              width: "100%",
              ...style
            }
          },
          renderChildren()
        );
      case "column": {
        const verticalAlign = style.verticalAlign;
        let justifyContent = "flex-start";
        if (verticalAlign === "middle") justifyContent = "center";
        if (verticalAlign === "bottom") justifyContent = "flex-end";
        return import_react10.default.createElement(
          "div",
          {
            style: {
              flex: 1,
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent,
              ...style
            }
          },
          renderChildren()
        );
      }
      case "text":
        return import_react10.default.createElement(
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
        return import_react10.default.createElement(
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
        return import_react10.default.createElement(
          "div",
          { style: { padding: "4px 0" } },
          import_react10.default.createElement(
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
        return import_react10.default.createElement("img", {
          src: node.props.src ?? "https://placehold.co/600x200/e2e8f0/64748b?text=Image",
          alt: node.props.alt ?? "",
          width: node.props.width ?? void 0,
          height: node.props.height ?? void 0,
          style: {
            maxWidth: "100%",
            height: node.props.height ? `${node.props.height}px` : "auto",
            display: "block",
            ...style
          }
        });
      case "link":
        return import_react10.default.createElement(
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
        return import_react10.default.createElement("hr", {
          style: {
            border: "none",
            borderTop: `${node.props.borderWidth ?? "1px"} solid ${node.props.borderColor ?? "#e2e8f0"}`,
            margin: "16px 0",
            ...style
          }
        });
      case "spacer":
        return import_react10.default.createElement("div", {
          style: {
            height: node.props.height ?? "20px",
            ...style
          }
        });
      default:
        return import_react10.default.createElement(
          "div",
          { style: { padding: "8px", color: "#94a3b8", fontSize: "12px" } },
          `[${node.type}]`
        );
    }
  };
  const isDropTarget = isOver && !isDragging;
  return import_react10.default.createElement(
    "div",
    {
      ref: mergedRef,
      className: `oe-canvas-node ${isDragging ? "oe-dragging" : ""} ${isDropTarget ? "oe-drop-target" : ""}`,
      "data-selected": isSelected ? "true" : "false",
      "data-label": label,
      "data-node-id": node.id,
      onClick: (e) => {
        e.stopPropagation();
        selectNode(node.id);
      },
      ...listeners,
      ...attributes
    },
    renderContent()
  );
}
function getEmptyLabel(type) {
  switch (type) {
    case "container":
      return "+ Add component";
    case "section":
      return "+ Add to section";
    case "row":
      return "+ Add column";
    case "column":
      return "+ Add content";
    default:
      return "+ Drop here";
  }
}
function VisualCanvas() {
  const { document, selectNode } = useEditor();
  const handleCanvasClick = (0, import_react10.useCallback)(() => {
    selectNode(null);
  }, [selectNode]);
  return import_react10.default.createElement(
    "div",
    { className: "oe-canvas", onClick: handleCanvasClick },
    import_react10.default.createElement(
      "div",
      { className: "oe-canvas-inner" },
      import_react10.default.createElement(CanvasNode, {
        node: document.body,
        parentId: "__root__",
        index: 0
      })
    )
  );
}
function CodeCanvas() {
  const { document, setDocument } = useEditor();
  const [code, setCode] = (0, import_react10.useState)(() => exportToJSON(document));
  const [error, setError] = (0, import_react10.useState)(null);
  (0, import_react10.useEffect)(() => {
    setCode(exportToJSON(document));
  }, [document]);
  const handleChange = (0, import_react10.useCallback)((e) => {
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
  return import_react10.default.createElement(
    "div",
    { className: "oe-code-editor" },
    error && import_react10.default.createElement(
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
    import_react10.default.createElement("textarea", {
      className: "oe-code-textarea",
      value: code,
      onChange: handleChange,
      spellCheck: false
    })
  );
}
function PreviewCanvas({ variableData }) {
  const { document } = useEditor();
  const [html, setHtml] = (0, import_react10.useState)("");
  const iframeRef = (0, import_react10.useRef)(null);
  (0, import_react10.useEffect)(() => {
    let cancelled = false;
    renderToHTML(document, variableData).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [document, variableData]);
  (0, import_react10.useEffect)(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);
  return import_react10.default.createElement(
    "div",
    { className: "oe-preview" },
    import_react10.default.createElement("iframe", {
      ref: iframeRef,
      className: "oe-preview-iframe",
      title: "Email Preview",
      sandbox: "allow-same-origin"
    })
  );
}
function EditorCanvas({ className, variableData }) {
  const { mode } = useEditor();
  const content = (0, import_react10.useMemo)(() => {
    switch (mode) {
      case "visual":
        return import_react10.default.createElement(VisualCanvas, null);
      case "code":
        return import_react10.default.createElement(CodeCanvas, null);
      case "preview":
        return import_react10.default.createElement(PreviewCanvas, { variableData });
      default:
        return import_react10.default.createElement(VisualCanvas, null);
    }
  }, [mode, variableData]);
  return content;
}

// src/components/properties-panel/properties-panel.tsx
var import_react16 = __toESM(require("react"));

// src/utils/dom-helpers.ts
function insertVariableIntoContent(existing, variableName) {
  const insert = `{{${variableName}}}`;
  const content = existing?.trim() || "";
  return content ? `${content} ${insert}` : insert;
}

// src/components/properties-panel/properties-panel-empty.tsx
var import_react11 = __toESM(require("react"));
function PropertiesPanelEmpty({ className }) {
  return import_react11.default.createElement(
    "div",
    { className: `oe-properties ${className ?? ""}` },
    import_react11.default.createElement(
      "div",
      { className: "oe-properties-empty" },
      import_react11.default.createElement(Icons.settings, { size: 32 }),
      import_react11.default.createElement(
        "p",
        null,
        "Select an element to edit its properties"
      )
    )
  );
}

// src/components/properties-panel/properties-panel-header.tsx
var import_react12 = __toESM(require("react"));
function PropertiesPanelHeader({
  title,
  onDelete
}) {
  return import_react12.default.createElement(
    "div",
    { className: "oe-properties-header" },
    import_react12.default.createElement(
      "span",
      { className: "oe-properties-title" },
      title
    ),
    import_react12.default.createElement(
      "button",
      {
        className: "oe-btn-icon",
        onClick: onDelete,
        title: "Delete element",
        style: { color: "var(--oe-danger)" }
      },
      import_react12.default.createElement(Icons.trash, { size: 16 })
    )
  );
}

// src/components/properties-panel/variable-inserter.tsx
var import_react13 = __toESM(require("react"));

// src/components/properties-panel/utils.ts
var CONTENT_NODE_TYPES = ["text", "heading", "link", "button"];
var CONTENT_KEY = {
  text: "content",
  heading: "content",
  link: "content",
  button: "text"
};
var VARIABLE_KEY_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
function isValidVariableKey(key) {
  return key.length > 0 && VARIABLE_KEY_REGEX.test(key);
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
var GROUP_LABELS = {
  content: "Content",
  layout: "Layout",
  style: "Style"
};
var GROUP_ORDER = ["content", "layout", "style"];

// src/components/properties-panel/variable-inserter.tsx
function VariableInserter({
  selectedNodeId,
  contentKey,
  currentContent,
  onInsert,
  onCreateAndInsert
}) {
  const variables = useVariables();
  const [variableSelectOpen, setVariableSelectOpen] = (0, import_react13.useState)(false);
  const [variableSearch, setVariableSearch] = (0, import_react13.useState)("");
  const [newVarName, setNewVarName] = (0, import_react13.useState)("");
  const [newVarFallback, setNewVarFallback] = (0, import_react13.useState)("");
  const [showCreateForm, setShowCreateForm] = (0, import_react13.useState)(false);
  const searchInputRef = (0, import_react13.useRef)(null);
  const comboboxRef = (0, import_react13.useRef)(null);
  (0, import_react13.useEffect)(() => {
    if (variableSelectOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [variableSelectOpen]);
  (0, import_react13.useEffect)(() => {
    const handleClickOutside = (e) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target)) {
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
  const handleInsertVariable = (0, import_react13.useCallback)(
    (variableName) => {
      onInsert(variableName);
      setVariableSelectOpen(false);
      setVariableSearch("");
      setShowCreateForm(false);
    },
    [onInsert]
  );
  const filteredVariables = (0, import_react13.useMemo)(() => {
    const entries = Object.entries(variables);
    const search = variableSearch.toLowerCase().trim();
    if (!search) return entries;
    return entries.filter(([name]) => name.toLowerCase().includes(search));
  }, [variables, variableSearch]);
  const variableCount = filteredVariables.length;
  return import_react13.default.createElement(
    "div",
    { className: "oe-properties-group" },
    import_react13.default.createElement(
      "div",
      { className: "oe-properties-group-title" },
      "Insert variable"
    ),
    import_react13.default.createElement(
      "div",
      { className: "oe-variable-combobox", ref: comboboxRef },
      variableSelectOpen ? import_react13.default.createElement(
        "div",
        { className: "oe-variable-combobox-dropdown" },
        import_react13.default.createElement("input", {
          ref: searchInputRef,
          type: "text",
          className: "oe-field-input",
          placeholder: "Search or create variable\u2026",
          value: variableSearch,
          onChange: (e) => setVariableSearch(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              setVariableSelectOpen(false);
              setVariableSearch("");
              setShowCreateForm(false);
            }
          }
        }),
        filteredVariables.length > 0 && import_react13.default.createElement(
          "div",
          { className: "oe-variable-combobox-list" },
          filteredVariables.map(
            ([name, def]) => import_react13.default.createElement(
              "button",
              {
                key: name,
                type: "button",
                className: "oe-variable-combobox-item",
                onClick: () => handleInsertVariable(name)
              },
              import_react13.default.createElement(
                "code",
                { className: "oe-variable-combobox-key" },
                `{{${name}}}`
              ),
              import_react13.default.createElement(
                "span",
                { className: "oe-variable-combobox-fallback" },
                def.fallback || "\u2014"
              )
            )
          )
        ),
        variableSearch.trim() && !variables[variableSearch.trim()] && isValidVariableKey(variableSearch.trim()) || showCreateForm ? import_react13.default.createElement(
          "div",
          { className: "oe-variable-combobox-create" },
          import_react13.default.createElement(
            "div",
            { className: "oe-variable-combobox-create-header" },
            "Create new variable"
          ),
          import_react13.default.createElement("input", {
            type: "text",
            className: "oe-field-input",
            placeholder: "variableName",
            value: showCreateForm ? newVarName : variableSearch.trim(),
            onChange: (e) => setNewVarName(e.target.value),
            "data-invalid": newVarName.trim() && !isValidVariableKey(newVarName.trim()) ? "true" : void 0
          }),
          import_react13.default.createElement("input", {
            type: "text",
            className: "oe-field-input",
            placeholder: "Fallback text",
            value: newVarFallback,
            onChange: (e) => setNewVarFallback(e.target.value)
          }),
          import_react13.default.createElement(
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
              disabled: !isValidVariableKey(
                showCreateForm ? newVarName.trim() : variableSearch.trim()
              )
            },
            "Create & Insert"
          )
        ) : filteredVariables.length === 0 && variableSearch.trim() && import_react13.default.createElement(
          "div",
          { className: "oe-variable-combobox-empty" },
          "No variables found. Type a valid name to create one."
        )
      ) : import_react13.default.createElement(
        "button",
        {
          type: "button",
          className: "oe-btn",
          onClick: () => setVariableSelectOpen(true)
        },
        variableCount > 0 ? `Insert variable (${variableCount})` : "Create variable\u2026"
      )
    )
  );
}

// src/components/properties-panel/properties-group.tsx
var import_react15 = __toESM(require("react"));

// src/components/properties-panel/property-field.tsx
var import_react14 = __toESM(require("react"));
function PropertyField({ schema, value, onChange }) {
  const handleChange = (0, import_react14.useCallback)(
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
      return import_react14.default.createElement(
        "div",
        { className: "oe-field" },
        import_react14.default.createElement(
          "label",
          { className: "oe-field-label" },
          schema.label
        ),
        import_react14.default.createElement("textarea", {
          className: "oe-field-textarea",
          value: stringValue,
          onChange: handleChange,
          placeholder: schema.placeholder ?? ""
        })
      );
    case "select":
      return import_react14.default.createElement(
        "div",
        { className: "oe-field" },
        import_react14.default.createElement(
          "label",
          { className: "oe-field-label" },
          schema.label
        ),
        import_react14.default.createElement(
          "select",
          {
            className: "oe-field-select",
            value: stringValue,
            onChange: handleChange
          },
          import_react14.default.createElement("option", { value: "" }, "\u2014"),
          ...(schema.options ?? []).map(
            (opt) => import_react14.default.createElement(
              "option",
              { key: opt.value, value: opt.value },
              opt.label
            )
          )
        )
      );
    case "color":
      return import_react14.default.createElement(
        "div",
        { className: "oe-field" },
        import_react14.default.createElement(
          "label",
          { className: "oe-field-label" },
          schema.label
        ),
        import_react14.default.createElement(
          "div",
          { className: "oe-field-color-wrapper" },
          import_react14.default.createElement("input", {
            type: "color",
            className: "oe-field-color-swatch",
            value: stringValue || "#000000",
            onChange: handleChange
          }),
          import_react14.default.createElement("input", {
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
      return import_react14.default.createElement(
        "div",
        { className: "oe-field" },
        import_react14.default.createElement(
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
          import_react14.default.createElement("input", {
            type: "checkbox",
            checked: !!value,
            onChange: handleChange
          }),
          schema.label
        )
      );
    case "number":
      return import_react14.default.createElement(
        "div",
        { className: "oe-field" },
        import_react14.default.createElement(
          "label",
          { className: "oe-field-label" },
          schema.label
        ),
        import_react14.default.createElement("input", {
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
      return import_react14.default.createElement(
        "div",
        { className: "oe-field" },
        import_react14.default.createElement(
          "label",
          { className: "oe-field-label" },
          schema.label
        ),
        import_react14.default.createElement("input", {
          type: schema.type === "url" ? "url" : "text",
          className: "oe-field-input",
          value: stringValue,
          onChange: handleChange,
          placeholder: schema.placeholder ?? ""
        })
      );
  }
}

// src/components/properties-panel/properties-group.tsx
function PropertiesGroup({
  group,
  properties,
  nodeProps,
  onChange
}) {
  return import_react15.default.createElement(
    "div",
    { className: "oe-properties-group" },
    import_react15.default.createElement(
      "div",
      { className: "oe-properties-group-title" },
      GROUP_LABELS[group] ?? group
    ),
    ...properties.map(
      (prop) => import_react15.default.createElement(PropertyField, {
        key: prop.key,
        schema: prop,
        value: resolveValue(nodeProps, prop.key),
        onChange
      })
    )
  );
}

// src/components/properties-panel/properties-panel.tsx
function PropertiesPanel({ className, registry }) {
  const { selectedNodeId, document: emailDocument, updateNode: updateNode2, deleteNode, updateVariables } = useEditor();
  const selectedNode = useSelectedNode();
  const reg = registry ?? defaultRegistry;
  const definition = (0, import_react16.useMemo)(
    () => selectedNode ? reg.get(selectedNode.type) : void 0,
    [selectedNode, reg]
  );
  const handlePropertyChange = (0, import_react16.useCallback)(
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
  const handleDelete = (0, import_react16.useCallback)(() => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
    }
  }, [selectedNodeId, deleteNode]);
  const contentKey = selectedNode && CONTENT_KEY[selectedNode.type];
  const currentContent = contentKey && selectedNode?.props?.[contentKey];
  const handleInsertVariable = (0, import_react16.useCallback)(
    (variableName) => {
      if (!selectedNodeId || !contentKey) return;
      const newValue = insertVariableIntoContent(currentContent, variableName);
      updateNode2(selectedNodeId, { [contentKey]: newValue });
    },
    [selectedNodeId, contentKey, currentContent, updateNode2]
  );
  const handleCreateAndInsert = (0, import_react16.useCallback)(
    (name, fallback) => {
      const variables = emailDocument.variables ?? {};
      updateVariables({ ...variables, [name]: { fallback } });
      if (selectedNodeId && contentKey) {
        const newValue = insertVariableIntoContent(currentContent, name);
        updateNode2(selectedNodeId, { [contentKey]: newValue });
      }
    },
    [emailDocument.variables, updateVariables, selectedNodeId, contentKey, currentContent, updateNode2]
  );
  const groups = (0, import_react16.useMemo)(() => {
    if (!definition?.properties) return {};
    const grouped = {};
    for (const prop of definition.properties) {
      const group = prop.group ?? "content";
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(prop);
    }
    return grouped;
  }, [definition?.properties]);
  if (!selectedNode || !definition) {
    return import_react16.default.createElement(PropertiesPanelEmpty, { className });
  }
  const canInsertVariable = selectedNode && CONTENT_NODE_TYPES.includes(
    selectedNode.type
  );
  return import_react16.default.createElement(
    "div",
    { className: `oe-properties ${className ?? ""}` },
    import_react16.default.createElement(PropertiesPanelHeader, {
      title: definition.label,
      onDelete: handleDelete
    }),
    canInsertVariable && import_react16.default.createElement(VariableInserter, {
      selectedNodeId: selectedNodeId || void 0,
      contentKey: contentKey || void 0,
      currentContent: currentContent || void 0,
      onInsert: handleInsertVariable,
      onCreateAndInsert: handleCreateAndInsert
    }),
    ...GROUP_ORDER.filter((g) => groups[g] && groups[g].length > 0).map(
      (group) => import_react16.default.createElement(PropertiesGroup, {
        key: group,
        group,
        properties: groups[group],
        nodeProps: selectedNode.props ?? {},
        onChange: handlePropertyChange
      })
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
  variableData,
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
  return import_react17.default.createElement(
    EditorProvider,
    { initialDocument, onChange },
    import_react17.default.createElement(
      DragDropProvider,
      null,
      import_react17.default.createElement(
        "div",
        {
          className: `open-email-editor ${className ?? ""}`,
          "data-theme": theme,
          style
        },
        showToolbar && toolbar !== false && (toolbar ?? import_react17.default.createElement(EditorToolbar, {
          modes: availableModes,
          actions: toolbarActions,
          variableData,
          showExportJSON,
          showExportHTML,
          components,
          onExportHTML,
          onExportJSON
        })),
        import_react17.default.createElement(
          "div",
          { className: "oe-editor-body" },
          showSidebar && sidebar !== false && (sidebar ?? import_react17.default.createElement(EditorSidebar, { registry })),
          canvas ?? import_react17.default.createElement(EditorCanvas, { variableData }),
          showProperties && propertiesPanel !== false && (propertiesPanel ?? import_react17.default.createElement(PropertiesPanel, { registry }))
        )
      )
    )
  );
}

// src/components/variable-manager.tsx
var import_react18 = __toESM(require("react"));
var VARIABLE_KEY_REGEX2 = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
function isValidVariableKey2(key) {
  return key.length > 0 && VARIABLE_KEY_REGEX2.test(key);
}
function VariableManager({ className }) {
  const { document, updateVariables } = useEditor();
  const variables = document.variables ?? {};
  const [editingKey, setEditingKey] = (0, import_react18.useState)(null);
  const [newKey, setNewKey] = (0, import_react18.useState)("");
  const [newFallback, setNewFallback] = (0, import_react18.useState)("");
  const [addMode, setAddMode] = (0, import_react18.useState)(false);
  const entries = Object.entries(variables);
  const handleSaveEdit = (0, import_react18.useCallback)(
    (key, fallback) => {
      const next = { ...variables, [key]: { fallback } };
      updateVariables(next);
      setEditingKey(null);
    },
    [variables, updateVariables]
  );
  const handleDelete = (0, import_react18.useCallback)(
    (key) => {
      const next = { ...variables };
      delete next[key];
      updateVariables(next);
      setEditingKey(null);
    },
    [variables, updateVariables]
  );
  const handleAdd = (0, import_react18.useCallback)(() => {
    const k = newKey.trim();
    const f = newFallback.trim();
    if (!isValidVariableKey2(k)) return;
    const next = { ...variables, [k]: { fallback: f } };
    updateVariables(next);
    setNewKey("");
    setNewFallback("");
    setAddMode(false);
  }, [variables, updateVariables, newKey, newFallback]);
  const startAdd = (0, import_react18.useCallback)(() => {
    setAddMode(true);
    setNewKey("");
    setNewFallback("");
  }, []);
  const cancelAdd = (0, import_react18.useCallback)(() => {
    setAddMode(false);
    setNewKey("");
    setNewFallback("");
  }, []);
  return import_react18.default.createElement(
    "div",
    { className: `oe-variable-manager ${className ?? ""}` },
    import_react18.default.createElement(
      "div",
      { className: "oe-variable-manager-header" },
      import_react18.default.createElement("span", { className: "oe-properties-group-title" }, "Variables"),
      import_react18.default.createElement(
        "button",
        {
          type: "button",
          className: "oe-btn-icon",
          onClick: addMode ? cancelAdd : startAdd,
          title: addMode ? "Cancel" : "Add variable"
        },
        import_react18.default.createElement(addMode ? Icons.close : Icons.plus, { size: 14 })
      )
    ),
    addMode && import_react18.default.createElement(
      "div",
      { className: "oe-variable-manager-add" },
      import_react18.default.createElement("input", {
        type: "text",
        className: "oe-field-input",
        placeholder: "variableName",
        value: newKey,
        onChange: (e) => setNewKey(e.target.value),
        "data-invalid": newKey.trim() && !isValidVariableKey2(newKey.trim()) ? "true" : void 0
      }),
      import_react18.default.createElement("input", {
        type: "text",
        className: "oe-field-input",
        placeholder: "Fallback text",
        value: newFallback,
        onChange: (e) => setNewFallback(e.target.value)
      }),
      import_react18.default.createElement(
        "button",
        {
          type: "button",
          className: "oe-btn oe-btn-primary",
          onClick: handleAdd,
          disabled: !isValidVariableKey2(newKey.trim())
        },
        "Add"
      )
    ),
    entries.length === 0 && !addMode ? import_react18.default.createElement(
      "div",
      { className: "oe-variable-manager-empty" },
      "No variables. Use {{name}} in text and add variables here."
    ) : entries.map(
      ([key, def]) => editingKey === key ? import_react18.default.createElement(VariableRowEdit, {
        key,
        name: key,
        fallback: def.fallback,
        onSave: (fallback) => handleSaveEdit(key, fallback),
        onDelete: () => handleDelete(key),
        onCancel: () => setEditingKey(null)
      }) : import_react18.default.createElement(
        "div",
        {
          key,
          className: "oe-variable-manager-row",
          onClick: () => setEditingKey(key)
        },
        import_react18.default.createElement("code", { className: "oe-variable-manager-key" }, `{{${key}}}`),
        import_react18.default.createElement("span", { className: "oe-variable-manager-fallback" }, def.fallback || "\u2014")
      )
    )
  );
}
function VariableRowEdit({ name, fallback, onSave, onDelete, onCancel }) {
  const [value, setValue] = (0, import_react18.useState)(fallback);
  return import_react18.default.createElement(
    "div",
    { className: "oe-variable-manager-row oe-variable-manager-row-edit" },
    import_react18.default.createElement("code", { className: "oe-variable-manager-key" }, `{{${name}}}`),
    import_react18.default.createElement("input", {
      type: "text",
      className: "oe-field-input",
      value,
      onChange: (e) => setValue(e.target.value),
      placeholder: "Fallback",
      onClick: (e) => e.stopPropagation()
    }),
    import_react18.default.createElement(
      "div",
      { className: "oe-variable-manager-actions" },
      import_react18.default.createElement(
        "button",
        { type: "button", className: "oe-btn-icon", onClick: () => onSave(value), title: "Save" },
        import_react18.default.createElement(Icons.check, { size: 14 })
      ),
      import_react18.default.createElement(
        "button",
        { type: "button", className: "oe-btn-icon", onClick: onCancel, title: "Cancel" },
        import_react18.default.createElement(Icons.close, { size: 14 })
      ),
      import_react18.default.createElement(
        "button",
        {
          type: "button",
          className: "oe-btn-icon",
          onClick: (e) => {
            e.stopPropagation();
            onDelete();
          },
          title: "Delete",
          style: { color: "var(--oe-danger)" }
        },
        import_react18.default.createElement(Icons.trash, { size: 14 })
      )
    )
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ComponentCard,
  DragDropProvider,
  EditorCanvas,
  EditorProvider,
  EditorSidebar,
  EditorToolbar,
  EmailEditor,
  Icons,
  LayerTree,
  PropertiesPanel,
  VariableManager,
  addNode,
  cloneNode,
  createEmptyDocument,
  createNode,
  createRegistry,
  defaultRegistry,
  exportToJSON,
  extractVariableNames,
  findNode,
  findParent,
  flattenTree,
  generateId,
  getComponentDef,
  getComponentsByCategory,
  getIcon,
  getNodePath,
  hasVariables,
  importFromJSON,
  interpolateVariables,
  mergeRegistries,
  moveNode,
  removeNode,
  renderToHTML,
  renderToPlainText,
  renderToReactEmail,
  updateNode,
  useContainerDropZone,
  useDragDrop,
  useDropZone,
  useEditor,
  useNode,
  useNodeDraggable,
  useNodeDroppable,
  useSelectedNode,
  useSidebarDraggable,
  useVariables,
  validateDocument
});
//# sourceMappingURL=index.js.map