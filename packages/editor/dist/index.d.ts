import * as React$1 from 'react';
import React__default, { ReactNode } from 'react';
import * as _dnd_kit_core from '@dnd-kit/core';
import * as _dnd_kit_utilities from '@dnd-kit/utilities';
import * as _dnd_kit_core_dist_hooks_utilities from '@dnd-kit/core/dist/hooks/utilities';

/** Unique identifier for document nodes */
type NodeId = string;
/** Supported email component types */
type EmailNodeType = "container" | "section" | "row" | "column" | "text" | "heading" | "button" | "image" | "link" | "hr" | "spacer" | "code-block" | "code-inline" | "markdown" | "preview" | "font";
/** Base props shared across all nodes */
interface BaseNodeProps {
    style?: React.CSSProperties;
    className?: string;
}
/** Container node props */
interface ContainerProps extends BaseNodeProps {
    /** Maximum width, e.g. "600px" */
    maxWidth?: string;
}
/** Section node props */
interface SectionProps extends BaseNodeProps {
}
/** Row node props */
interface RowProps extends BaseNodeProps {
}
/** Column node props */
interface ColumnProps extends BaseNodeProps {
}
/** Text node props */
interface TextProps extends BaseNodeProps {
    content?: string;
}
/** Heading node props */
interface HeadingProps extends BaseNodeProps {
    content?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}
/** Button node props */
interface ButtonProps extends BaseNodeProps {
    text?: string;
    href?: string;
    backgroundColor?: string;
    color?: string;
    borderRadius?: string;
    padding?: string;
}
/** Image node props */
interface ImageProps extends BaseNodeProps {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
}
/** Link node props */
interface LinkProps extends BaseNodeProps {
    href?: string;
    content?: string;
    color?: string;
}
/** Hr (divider) node props */
interface HrProps extends BaseNodeProps {
    borderColor?: string;
    borderWidth?: string;
}
/** Spacer node props */
interface SpacerProps extends BaseNodeProps {
    height?: string;
}
/** Union of all node prop types */
type EmailNodeProps = ContainerProps | SectionProps | RowProps | ColumnProps | TextProps | HeadingProps | ButtonProps | ImageProps | LinkProps | HrProps | SpacerProps;
/** A single node in the email document tree */
interface EmailNode {
    /** Unique identifier */
    id: NodeId;
    /** Component type */
    type: EmailNodeType;
    /** Component-specific props */
    props: Record<string, unknown>;
    /** Child nodes (for layout components) */
    children?: EmailNode[];
}
/** Root document representing a complete email template */
interface EmailDocument {
    /** Document version for schema migrations */
    version: 1;
    /** Template metadata */
    meta: {
        title: string;
        description?: string;
        previewText?: string;
        /** Subject line */
        subject?: string;
    };
    /** Root body node containing the email tree */
    body: EmailNode;
}
/** Editor display mode */
type EditorMode = "visual" | "code" | "preview";
/** Editor state */
interface EditorState {
    /** The current document being edited */
    document: EmailDocument;
    /** ID of the currently selected node */
    selectedNodeId: NodeId | null;
    /** Current display mode */
    mode: EditorMode;
    /** Whether the document has unsaved changes */
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
    type: "SET_MODE";
    payload: EditorMode;
} | {
    type: "MARK_CLEAN";
};
/** Schema for a single editable property */
interface PropertySchema {
    /** Property key in the node props */
    key: string;
    /** Display label */
    label: string;
    /** Input type for the property editor */
    type: "text" | "textarea" | "number" | "color" | "select" | "toggle" | "url" | "spacing";
    /** Default value */
    defaultValue?: unknown;
    /** Options for select type */
    options?: {
        label: string;
        value: string;
    }[];
    /** Property group for UI organization */
    group?: "content" | "layout" | "style";
    /** Placeholder text */
    placeholder?: string;
}
/** Definition of a component in the registry */
interface ComponentDefinition {
    /** Unique type identifier matching EmailNodeType */
    type: EmailNodeType;
    /** Human-readable name */
    label: string;
    /** Icon name or SVG string */
    icon: string;
    /** Category for grouping */
    category: "layout" | "content" | "utility";
    /** Description shown in component palette */
    description: string;
    /** Default props when the component is added */
    defaultProps: Record<string, unknown>;
    /** Whether this component can contain children */
    acceptsChildren: boolean;
    /** Allowed child types (empty = any) */
    allowedChildTypes?: EmailNodeType[];
    /** Editable property definitions */
    properties: PropertySchema[];
}
/** Component registry mapping types to definitions */
type ComponentRegistry = Map<EmailNodeType, ComponentDefinition>;
/** Configuration for the EmailEditor component */
interface EditorConfig {
    /** Custom component registry (uses default if not provided) */
    registry?: ComponentRegistry;
    /** Available modes (defaults to all three) */
    availableModes?: EditorMode[];
    /** Whether to show the sidebar */
    showSidebar?: boolean;
    /** Whether to show the toolbar */
    showToolbar?: boolean;
    /** Whether to show the properties panel */
    showProperties?: boolean;
    /** Whether to show the JSON export button */
    showExportJSON?: boolean;
    /** Whether to show the HTML export button */
    showExportHTML?: boolean;
    /** Theme: "light" | "dark" | "system" */
    theme?: "light" | "dark" | "system";
    /** Custom class name for the root editor element */
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
    /** Called when HTML is exported */
    onExportHTML?: (html: string) => void;
    /** Called when JSON is exported */
    onExportJSON?: (json: string) => void;
}
declare function EmailEditor({ initialDocument, onChange, config, className, style, toolbar, sidebar, propertiesPanel, canvas, toolbarActions, components, onExportHTML, onExportJSON, }: EmailEditorProps): React__default.FunctionComponentElement<EditorProviderProps>;

interface EditorToolbarProps {
    className?: string;
    /** Override available modes */
    modes?: EditorMode[];
    /** Custom actions rendered on the right side (before export buttons) */
    actions?: React__default.ReactNode;
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
declare function EditorToolbar({ className, modes, actions, onExportHTML, onExportJSON, showExportJSON, showExportHTML, components, }: EditorToolbarProps): React__default.DetailedReactHTMLElement<{
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

interface EditorCanvasProps {
    className?: string;
}
declare function EditorCanvas({ className }: EditorCanvasProps): React__default.FunctionComponentElement<{}>;

interface PropertiesPanelProps {
    className?: string;
    registry?: ComponentRegistry;
}
declare function PropertiesPanel({ className, registry }: PropertiesPanelProps): React__default.DetailedReactHTMLElement<{
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
};
/** Get an icon component by name */
declare function getIcon(name: string): React__default.ComponentType<IconProps>;

interface EditorContextValue {
    state: EditorState;
    dispatch: React__default.Dispatch<EditorAction>;
}
interface EditorProviderProps {
    /** Initial document to load */
    initialDocument?: EmailDocument;
    /** Callback when document changes */
    onChange?: (document: EmailDocument) => void;
    children?: ReactNode;
}
declare function EditorProvider({ initialDocument, onChange, children, }: EditorProviderProps): React__default.FunctionComponentElement<React__default.ProviderProps<EditorContextValue | null>>;
/** Access the full editor state and dispatch */
declare function useEditor(): {
    /** Raw dispatch for custom actions */
    dispatch: React__default.Dispatch<EditorAction>;
    /** Set the entire document */
    setDocument: (doc: EmailDocument) => void;
    /** Select a node by ID */
    selectNode: (id: NodeId | null) => void;
    /** Update a node's props */
    updateNode: (id: NodeId, props: Record<string, unknown>) => void;
    /** Add a new node as a child of parentId */
    addNode: (parentId: NodeId, node: EmailNode, index?: number) => void;
    /** Delete a node by ID */
    deleteNode: (id: NodeId) => void;
    /** Move a node to a new parent */
    moveNode: (nodeId: NodeId, newParentId: NodeId, index?: number) => void;
    /** Switch editor mode */
    setMode: (mode: EditorMode) => void;
    /** Mark the document as clean (saved) */
    markClean: () => void;
    document: EmailDocument;
    selectedNodeId: NodeId | null;
    mode: EditorMode;
    isDirty: boolean;
};
/** Get the currently selected node */
declare function useSelectedNode(): EmailNode | null;
/** Get a specific node by ID */
declare function useNode(nodeId: NodeId): EmailNode | null;

/** Generate a unique node ID */
declare function generateId(): string;
/** Create a new node. Pass an `id` for deterministic output (e.g. SSR), otherwise one is auto-generated. */
declare function createNode(type: EmailNode["type"], props?: Record<string, unknown>, children?: EmailNode[], id?: string): EmailNode;
/** Deep clone a node and all its children, generating new IDs */
declare function cloneNode(node: EmailNode): EmailNode;
/** Find a node by ID in the tree (returns null if not found) */
declare function findNode(root: EmailNode, nodeId: NodeId): EmailNode | null;
/** Find the parent of a node by ID */
declare function findParent(root: EmailNode, nodeId: NodeId): EmailNode | null;
/** Get the path (array of IDs) from root to the given node */
declare function getNodePath(root: EmailNode, nodeId: NodeId): NodeId[];
/** Update a node's props immutably */
declare function updateNode(root: EmailNode, nodeId: NodeId, newProps: Record<string, unknown>): EmailNode;
/** Add a child node to a parent immutably */
declare function addNode(root: EmailNode, parentId: NodeId, node: EmailNode, index?: number): EmailNode;
/** Remove a node by ID immutably */
declare function removeNode(root: EmailNode, nodeId: NodeId): EmailNode;
/** Move a node to a new parent immutably */
declare function moveNode(root: EmailNode, nodeId: NodeId, newParentId: NodeId, index?: number): EmailNode;
/** Get a flat list of all nodes in the tree */
declare function flattenTree(root: EmailNode): EmailNode[];
/** Validate a document structure */
declare function validateDocument(doc: EmailDocument): string[];
/** Create a default empty document */
declare function createEmptyDocument(title?: string): EmailDocument;

/**
 * Convert an EmailDocument into a React Email element tree.
 * Returns a full <Html><Head/><Preview/><Body>...</Body></Html> element.
 */
declare function renderToReactEmail(document: EmailDocument): React__default.ReactElement;

/**
 * Render an EmailDocument to an HTML string.
 * This produces email-client-compatible HTML with table-based layout.
 */
declare function renderToHTML(document: EmailDocument): Promise<string>;
/**
 * Render an EmailDocument to plain text (for text-only email fallback).
 */
declare function renderToPlainText(document: EmailDocument): Promise<string>;

/**
 * Export an EmailDocument to a JSON string.
 */
declare function exportToJSON(document: EmailDocument, pretty?: boolean): string;
/**
 * Import an EmailDocument from a JSON string.
 * Validates the document structure and throws on invalid input.
 */
declare function importFromJSON(json: string): EmailDocument;

/** Create a new component registry from an array of definitions */
declare function createRegistry(definitions: ComponentDefinition[]): ComponentRegistry;
/** Merge a custom registry with the default one */
declare function mergeRegistries(base: ComponentRegistry, overrides: ComponentDefinition[]): ComponentRegistry;
/** Default component registry with all built-in components */
declare const defaultRegistry: ComponentRegistry;
/** Get all component definitions grouped by category */
declare function getComponentsByCategory(registry: ComponentRegistry): Record<string, ComponentDefinition[]>;
/** Get a single component definition by type */
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

export { type BaseNodeProps, type ButtonProps, type ColumnProps, ComponentCard, type ComponentCardProps, type ComponentDefinition, type ComponentRegistry, type ContainerProps, type DragData, DragDropProvider, type DropZoneData, type EditorAction, EditorCanvas, type EditorCanvasProps, type EditorConfig, type EditorMode, EditorProvider, type EditorProviderProps, EditorSidebar, type EditorSidebarProps, type EditorState, EditorToolbar, type EditorToolbarProps, type EmailDocument, EmailEditor, type EmailEditorProps, type EmailNode, type EmailNodeProps, type EmailNodeType, type HeadingProps, type HrProps, Icons, type ImageProps, LayerTree, type LayerTreeProps, type LinkProps, type NodeDragData, type NodeId, PropertiesPanel, type PropertiesPanelProps, type PropertySchema, type RowProps, type SectionProps, type SidebarDragData, type SpacerProps, type TextProps, addNode, cloneNode, createEmptyDocument, createNode, createRegistry, defaultRegistry, exportToJSON, findNode, findParent, flattenTree, generateId, getComponentDef, getComponentsByCategory, getIcon, getNodePath, importFromJSON, mergeRegistries, moveNode, removeNode, renderToHTML, renderToPlainText, renderToReactEmail, updateNode, useContainerDropZone, useDragDrop, useDropZone, useEditor, useNode, useNodeDraggable, useNodeDroppable, useSelectedNode, useSidebarDraggable, validateDocument };
