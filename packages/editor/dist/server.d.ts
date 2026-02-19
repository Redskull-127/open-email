import React from 'react';

/** Unique identifier for document nodes */
type NodeId = string;
/** Supported email component types */
type EmailNodeType = "container" | "section" | "row" | "column" | "text" | "heading" | "button" | "image" | "link" | "hr" | "spacer" | "code-block" | "code-inline" | "markdown" | "preview" | "font";
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

declare function renderToHTML(document: EmailDocument, variableData?: Record<string, string>): Promise<string>;
declare function renderToPlainText(document: EmailDocument, variableData?: Record<string, string>): Promise<string>;

declare function renderToReactEmail(document: EmailDocument, variableData?: Record<string, string>): React.ReactElement;

export { type EmailDocument, type EmailNode, renderToHTML, renderToPlainText, renderToReactEmail };
