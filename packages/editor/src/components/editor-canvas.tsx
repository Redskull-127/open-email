// ─── Editor Canvas ───────────────────────────────────────────────────────────
// Central editing area with visual, code, and preview modes.

import React, { useCallback, useState, useEffect, useRef, useMemo } from "react";
import { useEditor, useSelectedNode } from "../engine/editor-store";
import { defaultRegistry } from "../registry/component-registry";
import { exportToJSON, importFromJSON } from "../renderer/json-renderer";
import { renderToHTML } from "../renderer/html-renderer";
import type { EmailNode, NodeId } from "../types";
import { Icons } from "./icons";

// ─── Visual Canvas Node ──────────────────────────────────────────────────────

interface CanvasNodeProps {
    node: EmailNode;
}

function CanvasNode({ node }: CanvasNodeProps): React.ReactElement {
    const { selectedNodeId, selectNode } = useEditor();
    const isSelected = selectedNodeId === node.id;
    const def = defaultRegistry.get(node.type);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            selectNode(node.id);
        },
        [node.id, selectNode]
    );

    const label = def?.label ?? node.type;

    // Render the visual representation
    const renderContent = (): React.ReactNode => {
        const style = (node.props.style ?? {}) as React.CSSProperties;

        switch (node.type) {
            case "container":
                return React.createElement(
                    "div",
                    {
                        style: {
                            maxWidth: (node.props.maxWidth as string) ?? "600px",
                            margin: "0 auto",
                            padding: "20px",
                            ...style,
                        },
                    },
                    node.children?.map((child) =>
                        React.createElement(CanvasNode, { key: child.id, node: child })
                    ),
                    (!node.children || node.children.length === 0) &&
                    React.createElement(
                        "div",
                        { className: "oe-drop-zone" },
                        "+ Add component"
                    )
                );

            case "section":
                return React.createElement(
                    "div",
                    { style: { padding: "10px 0", ...style } },
                    node.children?.map((child) =>
                        React.createElement(CanvasNode, { key: child.id, node: child })
                    ),
                    (!node.children || node.children.length === 0) &&
                    React.createElement(
                        "div",
                        { className: "oe-drop-zone" },
                        "+ Add to section"
                    )
                );

            case "row":
                return React.createElement(
                    "div",
                    {
                        style: {
                            display: "flex",
                            gap: "8px",
                            width: "100%",
                            ...style,
                        },
                    },
                    node.children?.map((child) =>
                        React.createElement(CanvasNode, { key: child.id, node: child })
                    ),
                    (!node.children || node.children.length === 0) &&
                    React.createElement(
                        "div",
                        { className: "oe-drop-zone", style: { flex: 1 } },
                        "+ Add column"
                    )
                );

            case "column":
                return React.createElement(
                    "div",
                    {
                        style: {
                            flex: 1,
                            padding: "8px",
                            ...style,
                        },
                    },
                    node.children?.map((child) =>
                        React.createElement(CanvasNode, { key: child.id, node: child })
                    ),
                    (!node.children || node.children.length === 0) &&
                    React.createElement(
                        "div",
                        { className: "oe-drop-zone" },
                        "+ Add content"
                    )
                );

            case "text":
                return React.createElement(
                    "p",
                    {
                        style: {
                            margin: "0",
                            padding: "4px 0",
                            fontSize: "14px",
                            lineHeight: "1.6",
                            color: "#374151",
                            ...style,
                        },
                    },
                    (node.props.content as string) ?? ""
                );

            case "heading": {
                const Tag = (node.props.as as string) ?? "h2";
                const sizeMap: Record<string, string> = {
                    h1: "32px",
                    h2: "24px",
                    h3: "20px",
                    h4: "18px",
                    h5: "16px",
                    h6: "14px",
                };
                return React.createElement(
                    Tag,
                    {
                        style: {
                            margin: "0",
                            padding: "4px 0",
                            fontSize: sizeMap[Tag] ?? "24px",
                            fontWeight: "bold",
                            color: "#111827",
                            ...style,
                        },
                    },
                    (node.props.content as string) ?? ""
                );
            }

            case "button":
                return React.createElement(
                    "div",
                    { style: { padding: "4px 0" } },
                    React.createElement(
                        "a",
                        {
                            style: {
                                display: "inline-block",
                                padding: (node.props.padding as string) ?? "12px 24px",
                                backgroundColor:
                                    (node.props.backgroundColor as string) ?? "#5046e5",
                                color: (node.props.color as string) ?? "#ffffff",
                                borderRadius: (node.props.borderRadius as string) ?? "6px",
                                textDecoration: "none",
                                fontWeight: 600,
                                fontSize: "14px",
                                textAlign: "center" as const,
                                ...style,
                            },
                            href: "#",
                            onClick: (e: React.MouseEvent) => e.preventDefault(),
                        },
                        (node.props.text as string) ?? "Button"
                    )
                );

            case "image":
                return React.createElement("img", {
                    src:
                        (node.props.src as string) ??
                        "https://placehold.co/600x200/e2e8f0/64748b?text=Image",
                    alt: (node.props.alt as string) ?? "",
                    width: (node.props.width as number) ?? undefined,
                    height: (node.props.height as number) ?? undefined,
                    style: {
                        maxWidth: "100%",
                        height: "auto",
                        display: "block",
                        ...style,
                    },
                });

            case "link":
                return React.createElement(
                    "a",
                    {
                        href: "#",
                        onClick: (e: React.MouseEvent) => e.preventDefault(),
                        style: {
                            color: (node.props.color as string) ?? "#5046e5",
                            textDecoration: "underline",
                            fontSize: "14px",
                            ...style,
                        },
                    },
                    (node.props.content as string) ?? "Link"
                );

            case "hr":
                return React.createElement("hr", {
                    style: {
                        border: "none",
                        borderTop: `${(node.props.borderWidth as string) ?? "1px"} solid ${(node.props.borderColor as string) ?? "#e2e8f0"
                            }`,
                        margin: "16px 0",
                        ...style,
                    },
                });

            case "spacer":
                return React.createElement("div", {
                    style: {
                        height: (node.props.height as string) ?? "20px",
                        ...style,
                    },
                });

            default:
                return React.createElement(
                    "div",
                    { style: { padding: "8px", color: "#94a3b8", fontSize: "12px" } },
                    `[${node.type}]`
                );
        }
    };

    return React.createElement(
        "div",
        {
            className: "oe-canvas-node",
            "data-selected": isSelected ? "true" : "false",
            "data-label": label,
            "data-node-id": node.id,
            onClick: handleClick,
        },
        renderContent()
    );
}

// ─── Visual Mode ─────────────────────────────────────────────────────────────

function VisualCanvas() {
    const { document, selectNode } = useEditor();

    const handleCanvasClick = useCallback(() => {
        selectNode(null);
    }, [selectNode]);

    return React.createElement(
        "div",
        { className: "oe-canvas", onClick: handleCanvasClick },
        React.createElement(
            "div",
            { className: "oe-canvas-inner" },
            React.createElement(CanvasNode, { node: document.body })
        )
    );
}

// ─── Code Mode ───────────────────────────────────────────────────────────────

function CodeCanvas() {
    const { document, setDocument } = useEditor();
    const [code, setCode] = useState(() => exportToJSON(document));
    const [error, setError] = useState<string | null>(null);

    // Sync when document changes externally
    useEffect(() => {
        setCode(exportToJSON(document));
    }, [document]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        setCode(newCode);
        try {
            const parsed = importFromJSON(newCode);
            setDocument(parsed);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        }
    }, [setDocument]);

    return React.createElement(
        "div",
        { className: "oe-code-editor" },
        error &&
        React.createElement(
            "div",
            {
                style: {
                    padding: "8px 12px",
                    background: "#fef2f2",
                    color: "#dc2626",
                    fontSize: "12px",
                    borderBottom: "1px solid #fecaca",
                },
            },
            "⚠ ",
            error
        ),
        React.createElement("textarea", {
            className: "oe-code-textarea",
            value: code,
            onChange: handleChange,
            spellCheck: false,
        })
    );
}

// ─── Preview Mode ────────────────────────────────────────────────────────────

function PreviewCanvas() {
    const { document } = useEditor();
    const [html, setHtml] = useState<string>("");
    const iframeRef = useRef<HTMLIFrameElement>(null);

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

    return React.createElement(
        "div",
        { className: "oe-preview" },
        React.createElement("iframe", {
            ref: iframeRef,
            className: "oe-preview-iframe",
            title: "Email Preview",
            sandbox: "allow-same-origin",
        })
    );
}

// ─── Main Canvas Component ───────────────────────────────────────────────────

export interface EditorCanvasProps {
    className?: string;
}

export function EditorCanvas({ className }: EditorCanvasProps) {
    const { mode } = useEditor();

    const content = useMemo(() => {
        switch (mode) {
            case "visual":
                return React.createElement(VisualCanvas, null);
            case "code":
                return React.createElement(CodeCanvas, null);
            case "preview":
                return React.createElement(PreviewCanvas, null);
            default:
                return React.createElement(VisualCanvas, null);
        }
    }, [mode]);

    return content;
}
