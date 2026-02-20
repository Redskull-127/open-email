import * as React$1 from 'react';
import React__default, { ReactNode } from 'react';
import * as _dnd_kit_core from '@dnd-kit/core';
import * as _dnd_kit_utilities from '@dnd-kit/utilities';
import * as _dnd_kit_core_dist_hooks_utilities from '@dnd-kit/core/dist/hooks/utilities';

type NodeId = string;
/** Supported email component types */
type EmailNodeType = "container" | "section" | "row" | "column" | "text" | "heading" | "button" | "image" | "link" | "hr" | "spacer" | "code-block" | "code-inline" | "markdown" | "html" | "preview" | "font" | "tailwind";
interface BaseNodeProps {
    style?: React.CSSProperties;
    className?: string;
}
interface ContainerProps extends BaseNodeProps {
    maxWidth?: string;
}
interface SectionProps extends BaseNodeProps {
}
interface RowProps extends BaseNodeProps {
}
interface ColumnProps extends BaseNodeProps {
}
interface TextProps extends BaseNodeProps {
    content?: string;
}
interface HeadingProps extends BaseNodeProps {
    content?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}
interface ButtonProps extends BaseNodeProps {
    text?: string;
    href?: string;
    backgroundColor?: string;
    color?: string;
    borderRadius?: string;
    padding?: string;
}
interface ImageProps extends BaseNodeProps {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
}
interface LinkProps extends BaseNodeProps {
    href?: string;
    content?: string;
    color?: string;
}
interface HrProps extends BaseNodeProps {
    borderColor?: string;
    borderWidth?: string;
}
interface SpacerProps extends BaseNodeProps {
    height?: string;
}
type EmailNodeProps = ContainerProps | SectionProps | RowProps | ColumnProps | TextProps | HeadingProps | ButtonProps | ImageProps | LinkProps | HrProps | SpacerProps;
interface EmailNode {
    id: NodeId;
    type: EmailNodeType;
    props: Record<string, unknown>;
    children?: EmailNode[];
}
interface VariableDefinition {
    fallback: string;
}
interface FontConfig {
    fontFamily: string;
    fallbackFontFamily?: string;
    webFontUrl?: string;
    webFontFormat?: "woff2" | "woff" | "ttf" | "otf";
    fontWeight?: number | string;
    fontStyle?: "normal" | "italic" | "oblique";
}
interface EmailDocument {
    version: 1;
    meta: {
        title: string;
        description?: string;
        previewText?: string;
        subject?: string;
        fonts?: FontConfig[];
        tailwind?: {
            enabled: boolean;
            config?: string;
        };
    };
    body: EmailNode;
    /** Variables referenced in content as {{variableName}} */
    variables?: Record<string, VariableDefinition>;
}
type EditorMode = "visual" | "code" | "preview";
interface EditorState {
    document: EmailDocument;
    selectedNodeId: NodeId | null;
    mode: EditorMode;
    isDirty: boolean;
}
/** Editor action types */
type EditorAction = {
    type: "SET_DOCUMENT";
    payload: EmailDocument;
} | {
    type: "SELECT_NODE";
    payload: NodeId | null;
} | {
    type: "UPDATE_NODE";
    payload: {
        id: NodeId;
        props: Record<string, unknown>;
    };
} | {
    type: "ADD_NODE";
    payload: {
        parentId: NodeId;
        node: EmailNode;
        index?: number;
    };
} | {
    type: "DELETE_NODE";
    payload: NodeId;
} | {
    type: "MOVE_NODE";
    payload: {
        nodeId: NodeId;
        newParentId: NodeId;
        index?: number;
    };
} | {
    type: "UPDATE_VARIABLES";
    payload: Record<string, VariableDefinition>;
} | {
    type: "UPDATE_DOCUMENT_META";
    payload: Partial<EmailDocument["meta"]>;
} | {
    type: "CREATE_VARIABLE_AND_UPDATE_NODE";
    payload: {
        variables: Record<string, VariableDefinition>;
        nodeId: NodeId;
        contentKey: string;
        newContent: string;
    };
} | {
    type: "SET_MODE";
    payload: EditorMode;
} | {
    type: "MARK_CLEAN";
};
interface PropertySchema {
    key: string;
    label: string;
    type: "text" | "textarea" | "number" | "color" | "select" | "toggle" | "url" | "spacing";
    defaultValue?: unknown;
    options?: {
        label: string;
        value: string;
    }[];
    group?: "content" | "layout" | "style";
    placeholder?: string;
}
interface ComponentDefinition {
    type: EmailNodeType;
    label: string;
    icon: string;
    category: "layout" | "content" | "utility";
    description: string;
    defaultProps: Record<string, unknown>;
    acceptsChildren: boolean;
    allowedChildTypes?: EmailNodeType[];
    properties: PropertySchema[];
}
type ComponentRegistry = Map<EmailNodeType, ComponentDefinition>;
interface EditorConfig {
    registry?: ComponentRegistry;
    availableModes?: EditorMode[];
    showSidebar?: boolean;
    showToolbar?: boolean;
    showProperties?: boolean;
    showExportJSON?: boolean;
    showExportHTML?: boolean;
    theme?: "light" | "dark" | "system";
    className?: string;
}

interface EmailEditorProps {
    /** Initial document to edit */
    initialDocument?: EmailDocument;
    /** Callback fired whenever the document changes */
    onChange?: (document: EmailDocument) => void;
    /** Editor configuration */
    config?: EditorConfig;
    /** Custom class name */
    className?: string;
    /** Custom style */
    style?: React__default.CSSProperties;
    /** Replace the toolbar entirely */
    toolbar?: React__default.ReactNode | false;
    /** Replace the sidebar entirely */
    sidebar?: React__default.ReactNode | false;
    /** Replace the properties panel entirely */
    propertiesPanel?: React__default.ReactNode | false;
    /** Replace the canvas entirely */
    canvas?: React__default.ReactNode;
    /** Extra toolbar actions */
    toolbarActions?: React__default.ReactNode;
    /** Custom component overrides */
    components?: {
        ExportJSONButton?: React__default.ComponentType<{
            onClick: () => void;
        }>;
        ExportHTMLButton?: React__default.ComponentType<{
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
declare function EmailEditor({ initialDocument, onChange, config, className, style, toolbar, sidebar, propertiesPanel, canvas, toolbarActions, components, variableData, onExportHTML, onExportJSON, }: EmailEditorProps): React__default.FunctionComponentElement<EditorProviderProps>;

interface EditorToolbarProps {
    className?: string;
    /** Override available modes */
    modes?: EditorMode[];
    /** Custom actions rendered on the right side (before export buttons) */
    actions?: React__default.ReactNode;
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
        ExportJSONButton?: React__default.ComponentType<{
            onClick: () => void;
        }>;
        ExportHTMLButton?: React__default.ComponentType<{
            onClick: () => void;
            loading?: boolean;
        }>;
    };
}
declare function EditorToolbar({ className, modes, actions, variableData, onExportHTML, onExportJSON, showExportJSON, showExportHTML, components, }: EditorToolbarProps): React__default.DetailedReactHTMLElement<{
    className: string;
}, HTMLElement>;

interface EditorSidebarProps {
    className?: string;
    /** Custom component registry */
    registry?: ComponentRegistry;
    /** Initial active tab */
    defaultTab?: "components" | "layers";
}
declare function EditorSidebar({ className, registry, defaultTab, }: EditorSidebarProps): React__default.DetailedReactHTMLElement<{
    className: string;
}, HTMLElement>;

interface PreviewCanvasProps {
    variableData?: Record<string, string>;
}
interface EditorCanvasProps {
    className?: string;
    /** Variable values for {{variableName}} interpolation in preview */
    variableData?: Record<string, string>;
}
declare function EditorCanvas({ className, variableData }: EditorCanvasProps): React__default.FunctionComponentElement<{}> | React__default.FunctionComponentElement<PreviewCanvasProps>;

interface DocumentMeta {
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
interface PropertiesPanelEmptyProps {
    className?: string;
    meta?: DocumentMeta;
    onMetaChange?: (update: Partial<DocumentMeta>) => void;
}

interface PropertiesPanelProps {
    className?: string;
    registry?: ComponentRegistry;
}
declare function PropertiesPanel({ className, registry }: PropertiesPanelProps): React__default.FunctionComponentElement<PropertiesPanelEmptyProps> | React__default.DetailedReactHTMLElement<{
    className: string;
}, HTMLElement>;

interface VariableManagerProps {
    className?: string;
}
declare function VariableManager({ className }: VariableManagerProps): React__default.DetailedReactHTMLElement<{
    className: string;
}, HTMLElement>;

interface LayerTreeProps {
    className?: string;
}
declare function LayerTree({ className }: LayerTreeProps): React__default.DetailedReactHTMLElement<{
    className: string;
}, HTMLElement>;

interface ComponentCardProps {
    definition: ComponentDefinition;
    onClick: (definition: ComponentDefinition) => void;
    className?: string;
}
declare function ComponentCard({ definition, onClick, className }: ComponentCardProps): React__default.DetailedReactHTMLElement<{
    role: string;
    tabIndex: number;
    'aria-disabled': boolean;
    'aria-pressed': boolean | undefined;
    'aria-roledescription': string;
    'aria-describedby': string;
    ref: (element: HTMLElement | null) => void;
    className: string;
    onClick: () => void;
    title: string;
}, HTMLElement>;

interface IconProps {
    size?: number;
    className?: string;
}
declare const Icons: {
    box: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    layout: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    columns: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    sidebar: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    type: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    heading: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    mousePointer: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    image: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    externalLink: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    minus: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    moveVertical: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    eye: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    code: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    monitor: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    download: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    trash: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    plus: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    layers: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    chevronRight: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    chevronDown: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    settings: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    copy: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    check: ({ size, className }: IconProps) => React__default.ReactSVGElement;
    close: ({ size, className }: IconProps) => React__default.ReactSVGElement;
};
/** Get an icon component by name */
declare function getIcon(name: string): React__default.ComponentType<IconProps>;

interface EditorContextValue {
    state: EditorState;
    dispatch: React__default.Dispatch<EditorAction>;
}
interface EditorProviderProps {
    initialDocument?: EmailDocument;
    onChange?: (document: EmailDocument) => void;
    children?: ReactNode;
}
declare function EditorProvider({ initialDocument, onChange, children, }: EditorProviderProps): React__default.FunctionComponentElement<React__default.ProviderProps<EditorContextValue | null>>;
declare function useEditor(): {
    dispatch: React__default.Dispatch<EditorAction>;
    setDocument: (doc: EmailDocument) => void;
    selectNode: (id: NodeId | null) => void;
    updateNode: (id: NodeId, props: Record<string, unknown>) => void;
    addNode: (parentId: NodeId, node: EmailNode, index?: number) => void;
    deleteNode: (id: NodeId) => void;
    moveNode: (nodeId: NodeId, newParentId: NodeId, index?: number) => void;
    updateVariables: (variables: Record<string, {
        fallback: string;
    }>) => void;
    updateDocumentMeta: (meta: Partial<EmailDocument["meta"]>) => void;
    createVariableAndInsert: (variables: Record<string, {
        fallback: string;
    }>, nodeId: NodeId, contentKey: string, newContent: string) => void;
    setMode: (mode: EditorMode) => void;
    markClean: () => void;
    document: EmailDocument;
    selectedNodeId: NodeId | null;
    mode: EditorMode;
    isDirty: boolean;
};
declare function useSelectedNode(): EmailNode | null;
declare function useNode(nodeId: NodeId): EmailNode | null;
declare function useVariables(): Record<string, {
    fallback: string;
}>;

declare function generateId(): string;
declare function createNode(type: EmailNode["type"], props?: Record<string, unknown>, children?: EmailNode[], id?: string): EmailNode;
declare function cloneNode(node: EmailNode): EmailNode;
declare function findNode(root: EmailNode, nodeId: NodeId): EmailNode | null;
declare function findParent(root: EmailNode, nodeId: NodeId): EmailNode | null;
declare function getNodePath(root: EmailNode, nodeId: NodeId): NodeId[];
declare function updateNode(root: EmailNode, nodeId: NodeId, newProps: Record<string, unknown>): EmailNode;
declare function addNode(root: EmailNode, parentId: NodeId, node: EmailNode, index?: number): EmailNode;
declare function removeNode(root: EmailNode, nodeId: NodeId): EmailNode;
declare function moveNode(root: EmailNode, nodeId: NodeId, newParentId: NodeId, index?: number): EmailNode;
declare function flattenTree(root: EmailNode): EmailNode[];
declare function validateDocument(doc: EmailDocument): string[];
declare function createEmptyDocument(title?: string): EmailDocument;

declare function renderToReactEmail(document: EmailDocument, variableData?: Record<string, string>): React__default.ReactElement;

declare function renderToHTML(document: EmailDocument, variableData?: Record<string, string>): Promise<string>;
declare function renderToPlainText(document: EmailDocument, variableData?: Record<string, string>): Promise<string>;

type VariableDefinitions = Record<string, {
    fallback: string;
}>;
declare function interpolateVariables(content: string, variableData: Record<string, string | undefined> | undefined, variableDefinitions: VariableDefinitions | undefined): string;
declare function hasVariables(content: string): boolean;
declare function extractVariableNames(content: string): string[];

/**
 * Export an EmailDocument to a JSON string.
 */
declare function exportToJSON(document: EmailDocument, pretty?: boolean): string;
/**
 * Import an EmailDocument from a JSON string.
 * Validates the document structure and throws on invalid input.
 */
declare function importFromJSON(json: string): EmailDocument;

interface AIPropertySchema {
    key: string;
    label: string;
    type: string;
    defaultValue?: unknown;
    placeholder?: string;
    options?: Array<{
        value: string;
        label: string;
    }>;
}
interface AIComponentSchema {
    type: string;
    label: string;
    description: string;
    category: string;
    acceptsChildren: boolean;
    defaultProps: Record<string, unknown>;
    properties: AIPropertySchema[];
}
interface AIDocumentSchema {
    components: AIComponentSchema[];
    documentMeta: {
        description: string;
        fields: AIPropertySchema[];
    };
}
/**
 * Returns a fully self-describing schema of every available component and
 * document-level field. Feed this into an LLM system prompt so it can produce
 * valid EmailDocument JSON without hallucinating component types or prop names.
 *
 * @example
 * // In a server action / API route
 * import { getAISchema } from "@open-email/editor/server";
 *
 * const schema = getAISchema();
 * const systemPrompt = `You are an email builder. Use this schema:\n${JSON.stringify(schema)}`;
 */
declare function getAISchema(registry?: ComponentRegistry): AIDocumentSchema;

declare function createRegistry(definitions: ComponentDefinition[]): ComponentRegistry;
declare function mergeRegistries(base: ComponentRegistry, overrides: ComponentDefinition[]): ComponentRegistry;
declare const defaultRegistry: ComponentRegistry;
declare function getComponentsByCategory(registry: ComponentRegistry): Record<string, ComponentDefinition[]>;
declare function getComponentDef(registry: ComponentRegistry, type: EmailNodeType): ComponentDefinition | undefined;

/** Data attached to a sidebar draggable */
interface SidebarDragData {
    origin: "sidebar";
    componentType: string;
    label: string;
}
/** Data attached to a canvas/layer sortable */
interface NodeDragData {
    origin: "canvas" | "layers";
    nodeId: string;
    parentId: string;
    index: number;
    label: string;
}
type DragData = SidebarDragData | NodeDragData;
/** Data attached to a droppable zone */
interface DropZoneData {
    parentId: string;
    index: number;
}
interface DragDropContextValue {
    activeId: string | null;
    activeData: DragData | null;
    overId: string | null;
}
declare function useDragDrop(): DragDropContextValue;
interface DragDropProviderProps {
    children: ReactNode;
}
declare function DragDropProvider({ children }: DragDropProviderProps): React__default.FunctionComponentElement<_dnd_kit_core.DndContextProps>;

/** Makes a sidebar component card draggable. */
declare function useSidebarDraggable(componentType: string, label: string): {
    active: _dnd_kit_core.Active | null;
    activatorEvent: Event | null;
    activeNodeRect: _dnd_kit_core.ClientRect | null;
    attributes: _dnd_kit_core.DraggableAttributes;
    isDragging: boolean;
    listeners: _dnd_kit_core_dist_hooks_utilities.SyntheticListenerMap | undefined;
    node: React$1.MutableRefObject<HTMLElement | null>;
    over: _dnd_kit_core.Over | null;
    setNodeRef: (element: HTMLElement | null) => void;
    setActivatorNodeRef: (element: HTMLElement | null) => void;
    transform: _dnd_kit_utilities.Transform | null;
};
/** Makes an existing node draggable (for canvas and layer tree). */
declare function useNodeDraggable(nodeId: string, parentId: string, index: number, label: string, origin: "canvas" | "layers"): {
    active: _dnd_kit_core.Active | null;
    activatorEvent: Event | null;
    activeNodeRect: _dnd_kit_core.ClientRect | null;
    attributes: _dnd_kit_core.DraggableAttributes;
    isDragging: boolean;
    listeners: _dnd_kit_core_dist_hooks_utilities.SyntheticListenerMap | undefined;
    node: React$1.MutableRefObject<HTMLElement | null>;
    over: _dnd_kit_core.Over | null;
    setNodeRef: (element: HTMLElement | null) => void;
    setActivatorNodeRef: (element: HTMLElement | null) => void;
    transform: _dnd_kit_utilities.Transform | null;
};
/**
 * Creates a drop zone indicator between sibling nodes.
 * `parentId` = the parent container that will receive the dropped child.
 * `index`    = the insertion index within parent.children.
 */
declare function useDropZone(parentId: string, index: number): {
    active: _dnd_kit_core.Active | null;
    rect: React$1.MutableRefObject<_dnd_kit_core.ClientRect | null>;
    isOver: boolean;
    node: React$1.MutableRefObject<HTMLElement | null>;
    over: _dnd_kit_core.Over | null;
    setNodeRef: (element: HTMLElement | null) => void;
};
/**
 * Creates a droppable area for an empty container.
 * Inserts at index 0.
 */
declare function useContainerDropZone(containerId: string): {
    active: _dnd_kit_core.Active | null;
    rect: React$1.MutableRefObject<_dnd_kit_core.ClientRect | null>;
    isOver: boolean;
    node: React$1.MutableRefObject<HTMLElement | null>;
    over: _dnd_kit_core.Over | null;
    setNodeRef: (element: HTMLElement | null) => void;
};
/**
 * Makes a canvas node droppable.
 * When something is dropped ON a node:
 * - If it accepts children → insert at index 0 (inside)
 * - If it does not → insert after this node (parentId, index+1)
 */
declare function useNodeDroppable(nodeId: string, parentId: string, index: number, acceptsChildren: boolean): {
    active: _dnd_kit_core.Active | null;
    rect: React$1.MutableRefObject<_dnd_kit_core.ClientRect | null>;
    isOver: boolean;
    node: React$1.MutableRefObject<HTMLElement | null>;
    over: _dnd_kit_core.Over | null;
    setNodeRef: (element: HTMLElement | null) => void;
};

export { type AIComponentSchema, type AIDocumentSchema, type AIPropertySchema, type BaseNodeProps, type ButtonProps, type ColumnProps, ComponentCard, type ComponentCardProps, type ComponentDefinition, type ComponentRegistry, type ContainerProps, type DocumentMeta, type DragData, DragDropProvider, type DropZoneData, type EditorAction, EditorCanvas, type EditorCanvasProps, type EditorConfig, type EditorMode, EditorProvider, type EditorProviderProps, EditorSidebar, type EditorSidebarProps, type EditorState, EditorToolbar, type EditorToolbarProps, type EmailDocument, EmailEditor, type EmailEditorProps, type EmailNode, type EmailNodeProps, type EmailNodeType, type FontConfig, type HeadingProps, type HrProps, Icons, type ImageProps, LayerTree, type LayerTreeProps, type LinkProps, type NodeDragData, type NodeId, PropertiesPanel, type PropertiesPanelProps, type PropertySchema, type RowProps, type SectionProps, type SidebarDragData, type SpacerProps, type TextProps, type VariableDefinition, type VariableDefinitions, VariableManager, type VariableManagerProps, addNode, cloneNode, createEmptyDocument, createNode, createRegistry, defaultRegistry, exportToJSON, extractVariableNames, findNode, findParent, flattenTree, generateId, getAISchema, getComponentDef, getComponentsByCategory, getIcon, getNodePath, hasVariables, importFromJSON, interpolateVariables, mergeRegistries, moveNode, removeNode, renderToHTML, renderToPlainText, renderToReactEmail, updateNode, useContainerDropZone, useDragDrop, useDropZone, useEditor, useNode, useNodeDraggable, useNodeDroppable, useSelectedNode, useSidebarDraggable, useVariables, validateDocument };
