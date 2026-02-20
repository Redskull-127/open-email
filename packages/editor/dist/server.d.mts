import React$1 from 'react';

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

declare function renderToHTML(document: EmailDocument, variableData?: Record<string, string>): Promise<string>;
declare function renderToPlainText(document: EmailDocument, variableData?: Record<string, string>): Promise<string>;

declare function renderToReactEmail(document: EmailDocument, variableData?: Record<string, string>): React$1.ReactElement;

/**
 * Export an EmailDocument to a JSON string.
 */
declare function exportToJSON(document: EmailDocument, pretty?: boolean): string;
/**
 * Import an EmailDocument from a JSON string.
 * Validates the document structure and throws on invalid input.
 */
declare function importFromJSON(json: string): EmailDocument;

type VariableDefinitions = Record<string, {
    fallback: string;
}>;
declare function interpolateVariables(content: string, variableData: Record<string, string | undefined> | undefined, variableDefinitions: VariableDefinitions | undefined): string;
declare function hasVariables(content: string): boolean;
declare function extractVariableNames(content: string): string[];

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

declare function createRegistry(definitions: ComponentDefinition[]): ComponentRegistry;
declare function mergeRegistries(base: ComponentRegistry, overrides: ComponentDefinition[]): ComponentRegistry;
declare const defaultRegistry: ComponentRegistry;
declare function getComponentsByCategory(registry: ComponentRegistry): Record<string, ComponentDefinition[]>;
declare function getComponentDef(registry: ComponentRegistry, type: EmailNodeType): ComponentDefinition | undefined;

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

export { type AIComponentSchema, type AIDocumentSchema, type AIPropertySchema, type BaseNodeProps, type ButtonProps, type ColumnProps, type ComponentDefinition, type ComponentRegistry, type ContainerProps, type EmailDocument, type EmailNode, type EmailNodeProps, type EmailNodeType, type FontConfig, type HeadingProps, type HrProps, type ImageProps, type LinkProps, type NodeId, type PropertySchema, type RowProps, type SectionProps, type SpacerProps, type TextProps, type VariableDefinition, type VariableDefinitions, addNode, cloneNode, createEmptyDocument, createNode, createRegistry, defaultRegistry, exportToJSON, extractVariableNames, findNode, findParent, flattenTree, generateId, getAISchema, getComponentDef, getComponentsByCategory, getNodePath, hasVariables, importFromJSON, interpolateVariables, mergeRegistries, moveNode, removeNode, renderToHTML, renderToPlainText, renderToReactEmail, updateNode, validateDocument };
