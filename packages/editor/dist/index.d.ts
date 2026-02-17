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
/** Variable definition with fallback used when no data is provided at render time */
interface VariableDefinition {
    fallback: string;
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
    /** Document-level variables: unique key → definition with fallback. Referenced in content as {{variableName}} */
    variables?: Record<string, VariableDefinition>;
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
    type: "UPDATE_VARIABLES";
    payload: Record<string, VariableDefinition>;
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

interface PropertiesPanelEmptyProps {
    className?: string;
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
    /** Initial document to load */
    initialDocument?: EmailDocument;
    /** Callback when document changes */
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

export { type BaseNodeProps, type ButtonProps, type ColumnProps, ComponentCard, type ComponentCardProps, type ComponentDefinition, type ComponentRegistry, type ContainerProps, type DragData, DragDropProvider, type DropZoneData, type EditorAction, EditorCanvas, type EditorCanvasProps, type EditorConfig, type EditorMode, EditorProvider, type EditorProviderProps, EditorSidebar, type EditorSidebarProps, type EditorState, EditorToolbar, type EditorToolbarProps, type EmailDocument, EmailEditor, type EmailEditorProps, type EmailNode, type EmailNodeProps, type EmailNodeType, type HeadingProps, type HrProps, Icons, type ImageProps, LayerTree, type LayerTreeProps, type LinkProps, type NodeDragData, type NodeId, PropertiesPanel, type PropertiesPanelProps, type PropertySchema, type RowProps, type SectionProps, type SidebarDragData, type SpacerProps, type TextProps, type VariableDefinition, type VariableDefinitions, VariableManager, type VariableManagerProps, addNode, cloneNode, createEmptyDocument, createNode, createRegistry, defaultRegistry, exportToJSON, extractVariableNames, findNode, findParent, flattenTree, generateId, getComponentDef, getComponentsByCategory, getIcon, getNodePath, hasVariables, importFromJSON, interpolateVariables, mergeRegistries, moveNode, removeNode, renderToHTML, renderToPlainText, renderToReactEmail, updateNode, useContainerDropZone, useDragDrop, useDropZone, useEditor, useNode, useNodeDraggable, useNodeDroppable, useSelectedNode, useSidebarDraggable, useVariables, validateDocument };
