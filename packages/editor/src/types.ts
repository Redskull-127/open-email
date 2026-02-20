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
  | "html"
  | "preview"
  | "font"
  | "tailwind";

export interface BaseNodeProps {
  style?: React.CSSProperties;
  className?: string;
}

export interface ContainerProps extends BaseNodeProps {
  maxWidth?: string;
}

export interface SectionProps extends BaseNodeProps {}
export interface RowProps extends BaseNodeProps {}
export interface ColumnProps extends BaseNodeProps {}

export interface TextProps extends BaseNodeProps {
  content?: string;
}

export interface HeadingProps extends BaseNodeProps {
  content?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface ButtonProps extends BaseNodeProps {
  text?: string;
  href?: string;
  backgroundColor?: string;
  color?: string;
  borderRadius?: string;
  padding?: string;
}

export interface ImageProps extends BaseNodeProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface LinkProps extends BaseNodeProps {
  href?: string;
  content?: string;
  color?: string;
}

export interface HrProps extends BaseNodeProps {
  borderColor?: string;
  borderWidth?: string;
}

export interface SpacerProps extends BaseNodeProps {
  height?: string;
}

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

export interface EmailNode {
  id: NodeId;
  type: EmailNodeType;
  props: Record<string, unknown>;
  children?: EmailNode[];
}

export interface VariableDefinition {
  fallback: string;
}

export interface FontConfig {
  fontFamily: string;
  fallbackFontFamily?: string;
  webFontUrl?: string;
  webFontFormat?: "woff2" | "woff" | "ttf" | "otf";
  fontWeight?: number | string;
  fontStyle?: "normal" | "italic" | "oblique";
}

export interface EmailDocument {
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

export type EditorMode = "visual" | "code" | "preview";

export interface EditorState {
  document: EmailDocument;
  selectedNodeId: NodeId | null;
  mode: EditorMode;
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
  | { type: "UPDATE_VARIABLES"; payload: Record<string, VariableDefinition> }
  | { type: "UPDATE_DOCUMENT_META"; payload: Partial<EmailDocument["meta"]> }
  | {
      type: "CREATE_VARIABLE_AND_UPDATE_NODE";
      payload: {
        variables: Record<string, VariableDefinition>;
        nodeId: NodeId;
        contentKey: string;
        newContent: string;
      };
    }
  | { type: "SET_MODE"; payload: EditorMode }
  | { type: "MARK_CLEAN" };

export interface PropertySchema {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "color" | "select" | "toggle" | "url" | "spacing";
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
  group?: "content" | "layout" | "style";
  placeholder?: string;
}

export interface ComponentDefinition {
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

export type ComponentRegistry = Map<EmailNodeType, ComponentDefinition>;

export interface EditorConfig {
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
