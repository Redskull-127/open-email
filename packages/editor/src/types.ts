// ─── Email Document Schema ───────────────────────────────────────────────────
// JSON-based document model where each node maps 1:1 to a React Email component.
// This is the core data structure that powers both visual editing and code export.

/** Unique identifier for document nodes */
export type NodeId = string;

/** Supported email component types */
export type EmailNodeType =
  | "container"
  | "section"
  | "row"
  | "column"
  | "text"
  | "heading"
  | "button"
  | "image"
  | "link"
  | "hr"
  | "spacer"
  | "code-block"
  | "code-inline"
  | "markdown"
  | "preview"
  | "font";

/** Base props shared across all nodes */
export interface BaseNodeProps {
  style?: React.CSSProperties;
  className?: string;
}

/** Container node props */
export interface ContainerProps extends BaseNodeProps {
  /** Maximum width, e.g. "600px" */
  maxWidth?: string;
}

/** Section node props */
export interface SectionProps extends BaseNodeProps { }

/** Row node props */
export interface RowProps extends BaseNodeProps { }

/** Column node props */
export interface ColumnProps extends BaseNodeProps { }

/** Text node props */
export interface TextProps extends BaseNodeProps {
  content?: string;
}

/** Heading node props */
export interface HeadingProps extends BaseNodeProps {
  content?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/** Button node props */
export interface ButtonProps extends BaseNodeProps {
  text?: string;
  href?: string;
  backgroundColor?: string;
  color?: string;
  borderRadius?: string;
  padding?: string;
}

/** Image node props */
export interface ImageProps extends BaseNodeProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

/** Link node props */
export interface LinkProps extends BaseNodeProps {
  href?: string;
  content?: string;
  color?: string;
}

/** Hr (divider) node props */
export interface HrProps extends BaseNodeProps {
  borderColor?: string;
  borderWidth?: string;
}

/** Spacer node props */
export interface SpacerProps extends BaseNodeProps {
  height?: string;
}

/** Union of all node prop types */
export type EmailNodeProps =
  | ContainerProps
  | SectionProps
  | RowProps
  | ColumnProps
  | TextProps
  | HeadingProps
  | ButtonProps
  | ImageProps
  | LinkProps
  | HrProps
  | SpacerProps;

// ─── Email Node ──────────────────────────────────────────────────────────────

/** A single node in the email document tree */
export interface EmailNode {
  /** Unique identifier */
  id: NodeId;
  /** Component type */
  type: EmailNodeType;
  /** Component-specific props */
  props: Record<string, unknown>;
  /** Child nodes (for layout components) */
  children?: EmailNode[];
}

// ─── Email Document ──────────────────────────────────────────────────────────

/** Root document representing a complete email template */
export interface EmailDocument {
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

// ─── Editor Types ────────────────────────────────────────────────────────────

/** Editor display mode */
export type EditorMode = "visual" | "code" | "preview";

/** Editor state */
export interface EditorState {
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
export type EditorAction =
  | { type: "SET_DOCUMENT"; payload: EmailDocument }
  | { type: "SELECT_NODE"; payload: NodeId | null }
  | { type: "UPDATE_NODE"; payload: { id: NodeId; props: Record<string, unknown> } }
  | { type: "ADD_NODE"; payload: { parentId: NodeId; node: EmailNode; index?: number } }
  | { type: "DELETE_NODE"; payload: NodeId }
  | { type: "MOVE_NODE"; payload: { nodeId: NodeId; newParentId: NodeId; index?: number } }
  | { type: "SET_MODE"; payload: EditorMode }
  | { type: "MARK_CLEAN" };

// ─── Component Registry Types ────────────────────────────────────────────────

/** Schema for a single editable property */
export interface PropertySchema {
  /** Property key in the node props */
  key: string;
  /** Display label */
  label: string;
  /** Input type for the property editor */
  type: "text" | "textarea" | "number" | "color" | "select" | "toggle" | "url" | "spacing";
  /** Default value */
  defaultValue?: unknown;
  /** Options for select type */
  options?: { label: string; value: string }[];
  /** Property group for UI organization */
  group?: "content" | "layout" | "style";
  /** Placeholder text */
  placeholder?: string;
}

/** Definition of a component in the registry */
export interface ComponentDefinition {
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
export type ComponentRegistry = Map<EmailNodeType, ComponentDefinition>;

// ─── Editor Config ───────────────────────────────────────────────────────────

/** Configuration for the EmailEditor component */
export interface EditorConfig {
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
