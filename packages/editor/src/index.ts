export { EmailEditor } from "./components/email-editor";
export type { EmailEditorProps } from "./components/email-editor";

export { EditorToolbar } from "./components/editor-toolbar";
export type { EditorToolbarProps } from "./components/editor-toolbar";

export { EditorSidebar } from "./components/editor-sidebar";
export type { EditorSidebarProps } from "./components/editor-sidebar";

export { EditorCanvas } from "./components/editor-canvas";
export type { EditorCanvasProps } from "./components/editor-canvas";

export { PropertiesPanel } from "./components/properties-panel";
export type { PropertiesPanelProps } from "./components/properties-panel";
export type { DocumentMeta } from "./components/properties-panel";

export { VariableManager } from "./components/variable-manager";
export type { VariableManagerProps } from "./components/variable-manager";

export { LayerTree } from "./components/layer-tree";
export type { LayerTreeProps } from "./components/layer-tree";

export { ComponentCard } from "./components/component-card";
export type { ComponentCardProps } from "./components/component-card";

export { Icons, getIcon } from "./components/icons";

export {
    EditorProvider,
    useEditor,
    useSelectedNode,
    useNode,
    useVariables,
} from "./engine/editor-store";
export type { EditorProviderProps } from "./engine/editor-store";

export {
    createNode,
    cloneNode,
    findNode,
    findParent,
    getNodePath,
    updateNode,
    addNode,
    removeNode,
    moveNode,
    flattenTree,
    validateDocument,
    createEmptyDocument,
    generateId,
} from "./engine/operations";

export { renderToReactEmail } from "./renderer/react-email-renderer";
export { renderToHTML, renderToPlainText } from "./renderer/html-renderer";
export { interpolateVariables, hasVariables, extractVariableNames } from "./utils/variable-interpolation";
export type { VariableDefinitions } from "./utils/variable-interpolation";
export { exportToJSON, importFromJSON } from "./renderer/json-renderer";
export { getAISchema } from "./utils/ai-schema";
export type { AIDocumentSchema, AIComponentSchema, AIPropertySchema } from "./utils/ai-schema";

export {
    defaultRegistry,
    createRegistry,
    mergeRegistries,
    getComponentsByCategory,
    getComponentDef,
} from "./registry/component-registry";

export type {
    NodeId,
    EmailNodeType,
    EmailNode,
    EmailDocument,
    FontConfig,
    VariableDefinition,
    EditorState,
    EditorAction,
    EditorMode,
    EditorConfig,
    ComponentDefinition,
    ComponentRegistry,
    PropertySchema,
    BaseNodeProps,
    ContainerProps,
    SectionProps,
    RowProps,
    ColumnProps,
    TextProps,
    HeadingProps,
    ButtonProps,
    ImageProps,
    LinkProps,
    HrProps,
    SpacerProps,
    EmailNodeProps,
} from "./types";

export {
    DragDropProvider,
    useDragDrop,
    useSidebarDraggable,
    useNodeDraggable,
    useDropZone,
    useContainerDropZone,
    useNodeDroppable,
} from "./components/dnd";
export type {
    SidebarDragData,
    NodeDragData,
    DropZoneData,
    DragData,
} from "./components/dnd";
