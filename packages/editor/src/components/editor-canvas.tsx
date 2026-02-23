import React, { useCallback, useState, useEffect, useRef, useMemo } from "react";
import { useEditor } from "../engine/editor-store";
import { defaultRegistry } from "../registry/component-registry";
import { exportToJSON, importFromJSON } from "../renderer/json-renderer";
import { renderToHTML } from "../renderer/html-renderer";
import type { EmailNode } from "../types";
import { useNodeDraggable, useDropZone, useContainerDropZone, useNodeDroppable } from "./dnd";
import { buildNodePatchFromPropertyKey } from "../utils/node-props";
import {
    InlineTextEditor,
    getInlineContentKey,
    isInlineEditableNodeType,
    isInlineMultiline,
} from "./inline-editing";

interface DropIndicatorProps {
    parentId: string;
    index: number;
}

function DropIndicator({ parentId, index }: DropIndicatorProps) {
    const { setNodeRef, isOver } = useDropZone(parentId, index);

    return React.createElement("div", {
        ref: setNodeRef,
        className: `oe-drop-indicator ${isOver ? "oe-drop-indicator-active" : ""}`,
    });
}

interface EmptyContainerDropZoneProps {
    containerId: string;
    label?: string;
}

function EmptyContainerDropZone({ containerId, label }: EmptyContainerDropZoneProps) {
    const { setNodeRef, isOver } = useContainerDropZone(containerId);

    return React.createElement("div", {
        ref: setNodeRef,
        className: `oe-drop-zone ${isOver ? "oe-drop-zone-active" : ""}`,
    }, label ?? "+ Drop component here");
}

interface CanvasNodeProps {
    node: EmailNode;
    parentId: string;
    index: number;
    editingNodeId: string | null;
    setEditingNodeId: (nodeId: string | null) => void;
}

function CanvasNode({
    node,
    parentId,
    index,
    editingNodeId,
    setEditingNodeId,
}: CanvasNodeProps): React.ReactElement {
    const { selectedNodeId, selectNode, updateNode } = useEditor();
    const isSelected = selectedNodeId === node.id;
    const isInlineEditable = isInlineEditableNodeType(node.type);
    const inlineContentKey = getInlineContentKey(node.type);
    const isEditingInline = isInlineEditable && editingNodeId === node.id;
    const def = defaultRegistry.get(node.type);
    const label = def?.label ?? node.type;
    const hasChildren = node.children && node.children.length > 0;
    const acceptsChildren = def?.acceptsChildren ?? false;

    const {
        attributes,
        listeners,
        setNodeRef: setDragRef,
        isDragging,
    } = useNodeDraggable(node.id, parentId, index, label, "canvas");

    const {
        setNodeRef: setDropRef,
        isOver,
    } = useNodeDroppable(node.id, parentId, index, acceptsChildren);

    const mergedRef = useCallback(
        (el: HTMLElement | null) => {
            setDragRef(el);
            setDropRef(el);
        },
        [setDragRef, setDropRef]
    );

    const handleInlineCommit = useCallback((value: string) => {
        if (!inlineContentKey) return;
        updateNode(
            node.id,
            buildNodePatchFromPropertyKey(node.props, inlineContentKey, value)
        );
        setEditingNodeId(null);
    }, [inlineContentKey, updateNode, node.id, node.props, setEditingNodeId]);

    const handleInlineCancel = useCallback(() => {
        setEditingNodeId(null);
    }, [setEditingNodeId]);


    const renderChildren = (): React.ReactNode => {
        if (!acceptsChildren) return null;

        if (!hasChildren) {
            return React.createElement(EmptyContainerDropZone, {
                containerId: node.id,
                label: getEmptyLabel(node.type),
            });
        }

        const children = node.children!;
        const elements: React.ReactNode[] = [
            React.createElement(DropIndicator, {
                key: `drop-${node.id}-0`,
                parentId: node.id,
                index: 0,
            }),
        ];

        for (let i = 0; i < children.length; i++) {
            elements.push(
                React.createElement(CanvasNode, {
                    key: children[i].id,
                    node: children[i],
                    parentId: node.id,
                    index: i,
                    editingNodeId,
                    setEditingNodeId,
                }),
                React.createElement(DropIndicator, {
                    key: `drop-${node.id}-${i + 1}`,
                    parentId: node.id,
                    index: i + 1,
                })
            );
        }

        return elements;
    };

    const renderContent = (): React.ReactNode => {
        const style = (node.props.style ?? {}) as React.CSSProperties;
        const nodeClassName = (node.props.className as string) || undefined;

        switch (node.type) {
            case "container":
                return React.createElement(
                    "div",
                    {
                        className: nodeClassName,
                        style: {
                            maxWidth: (node.props.maxWidth as string) ?? "600px",
                            margin: "0 auto",
                            padding: "20px",
                            ...style,
                        },
                    },
                    renderChildren()
                );

            case "section":
                return React.createElement(
                    "div",
                    { className: nodeClassName, style: { padding: "10px 0", ...style } },
                    renderChildren()
                );

            case "row":
                return React.createElement(
                    "div",
                    {
                        className: nodeClassName,
                        style: { display: "flex", width: "100%", ...style },
                    },
                    renderChildren()
                );

            case "column": {
                const verticalAlign = (style as any).verticalAlign;
                let justifyContent = "flex-start";
                if (verticalAlign === "middle") justifyContent = "center";
                if (verticalAlign === "bottom") justifyContent = "flex-end";

                return React.createElement(
                    "div",
                    {
                        className: nodeClassName,
                        style: {
                            flex: 1,
                            padding: "8px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent,
                            ...style,
                        },
                    },
                    renderChildren()
                );
            }

            case "text":
                return React.createElement(InlineTextEditor, {
                    isEditing: isEditingInline,
                    multiline: isInlineMultiline(node.type),
                    value: (node.props.content as string) ?? "",
                    placeholder: "Type your text here...",
                    onCommit: handleInlineCommit,
                    onCancel: handleInlineCancel,
                    renderDisplay: (value: string) =>
                        React.createElement(
                            "p",
                            {
                                className: nodeClassName,
                                style: {
                                    margin: "0",
                                    padding: "4px 0",
                                    fontSize: "14px",
                                    lineHeight: "1.6",
                                    color: "#374151",
                                    ...style,
                                },
                            },
                            value
                        ),
                });

            case "heading": {
                const Tag = (node.props.as as string) ?? "h2";
                const sizeMap: Record<string, string> = {
                    h1: "32px", h2: "24px", h3: "20px",
                    h4: "18px", h5: "16px", h6: "14px",
                };
                return React.createElement(InlineTextEditor, {
                    isEditing: isEditingInline,
                    multiline: isInlineMultiline(node.type),
                    value: (node.props.content as string) ?? "",
                    placeholder: "Heading",
                    onCommit: handleInlineCommit,
                    onCancel: handleInlineCancel,
                    renderDisplay: (value: string) =>
                        React.createElement(
                            Tag,
                            {
                                className: nodeClassName,
                                style: {
                                    margin: "0",
                                    padding: "4px 0",
                                    fontSize: sizeMap[Tag] ?? "24px",
                                    fontWeight: "bold",
                                    color: "#111827",
                                    ...style,
                                },
                            },
                            value
                        ),
                });
            }

            case "button":
                return React.createElement(
                    "div",
                    { style: { padding: "4px 0" } },
                    React.createElement(
                        "a",
                        {
                            className: nodeClassName,
                            style: {
                                display: "inline-block",
                                padding: (node.props.padding as string) ?? "12px 24px",
                                backgroundColor: (node.props.backgroundColor as string) ?? "#5046e5",
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
                    className: nodeClassName,
                    src: (node.props.src as string) ?? "https://placehold.co/600x200/e2e8f0/64748b?text=Image",
                    alt: (node.props.alt as string) ?? "",
                    width: (node.props.width as number) ?? undefined,
                    height: (node.props.height as number) ?? undefined,
                    style: {
                        maxWidth: "100%",
                        height: node.props.height ? `${node.props.height}px` : "auto",
                        display: "block",
                        ...style,
                    },
                });

            case "link":
                return React.createElement(
                    "a",
                    {
                        className: nodeClassName,
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
                    className: nodeClassName,
                    style: {
                        border: "none",
                        borderTop: `${(node.props.borderWidth as string) ?? "1px"} solid ${(node.props.borderColor as string) ?? "#e2e8f0"}`,
                        margin: "16px 0",
                        ...style,
                    },
                });

            case "spacer":
                return React.createElement("div", {
                    className: nodeClassName,
                    style: { height: (node.props.height as string) ?? "20px", ...style },
                });

            case "code-inline": {
                const code = (node.props.code as string) ?? "";
                return React.createElement(
                    "code",
                    {
                        className: nodeClassName,
                        style: {
                            backgroundColor: (style.backgroundColor as string) ?? "#f3f4f6",
                            color: (style.color as string) ?? "#111827",
                            fontSize: (style.fontSize as string) ?? "14px",
                            fontFamily: (style.fontFamily as string) ?? "'Courier New', monospace",
                            padding: (style.padding as string) ?? "2px 4px",
                            borderRadius: (style.borderRadius as string) ?? "3px",
                            display: "inline-block",
                            ...style,
                        },
                    },
                    code
                );
            }

            case "code-block": {
                const code = (node.props.code as string) ?? "";
                return React.createElement(
                    "pre",
                    {
                        className: nodeClassName,
                        style: {
                            backgroundColor: (style.backgroundColor as string) ?? "#1f2937",
                            color: (style.color as string) ?? "#f9fafb",
                            fontSize: (style.fontSize as string) ?? "14px",
                            fontFamily: (style.fontFamily as string) ?? "'Courier New', monospace",
                            padding: (style.padding as string) ?? "16px",
                            borderRadius: (style.borderRadius as string) ?? "4px",
                            margin: "8px 0",
                            overflow: "auto",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            ...style,
                        },
                    },
                    React.createElement("code", { style: { display: "block", fontFamily: "inherit" } }, code)
                );
            }

            case "markdown": {
                const content = (node.props.content as string) ?? "";
                const textColor = (style.color as string) ?? "#374151";
                const fontSize = (style.fontSize as string) ?? "16px";
                const fontFamily = (style.fontFamily as string) ?? "Arial, sans-serif";
                const lineHeight = (style.lineHeight as string) ?? "1.6";

                // Simple markdown rendering for visual preview
                // Convert basic markdown to HTML-like display
                const renderMarkdown = (md: string): React.ReactNode => {
                    if (!md) return null;
                    
                    const lines = md.split("\n");
                    const elements: React.ReactNode[] = [];
                    
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        if (!line.trim() && i < lines.length - 1) {
                            elements.push(React.createElement("br", { key: `br-${i}` }));
                            continue;
                        }
                        
                        // Headers
                        if (line.startsWith("# ")) {
                            elements.push(
                                React.createElement(
                                    "h1",
                                    {
                                        key: `h1-${i}`,
                                        style: {
                                            fontSize: "32px",
                                            fontWeight: "bold",
                                            margin: "16px 0 8px 0",
                                            color: textColor,
                                        },
                                    },
                                    line.slice(2)
                                )
                            );
                        } else if (line.startsWith("## ")) {
                            elements.push(
                                React.createElement(
                                    "h2",
                                    {
                                        key: `h2-${i}`,
                                        style: {
                                            fontSize: "24px",
                                            fontWeight: "bold",
                                            margin: "14px 0 6px 0",
                                            color: textColor,
                                        },
                                    },
                                    line.slice(3)
                                )
                            );
                        } else if (line.startsWith("### ")) {
                            elements.push(
                                React.createElement(
                                    "h3",
                                    {
                                        key: `h3-${i}`,
                                        style: {
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            margin: "12px 0 4px 0",
                                            color: textColor,
                                        },
                                    },
                                    line.slice(4)
                                )
                            );
                        } else if (line.trim()) {
                            // Bold and italic
                            let processedLine = line;
                            processedLine = processedLine.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
                            processedLine = processedLine.replace(/\*(.+?)\*/g, "<em>$1</em>");
                            processedLine = processedLine.replace(/`(.+?)`/g, "<code style='background: #f3f4f6; padding: 2px 4px; border-radius: 3px; font-family: monospace;'>$1</code>");
                            
                            elements.push(
                                React.createElement(
                                    "p",
                                    {
                                        key: `p-${i}`,
                                        style: {
                                            margin: "8px 0",
                                            color: textColor,
                                        },
                                        dangerouslySetInnerHTML: { __html: processedLine },
                                    }
                                )
                            );
                        }
                    }
                    
                    return elements.length > 0 ? elements : null;
                };

                return React.createElement(InlineTextEditor, {
                    isEditing: isEditingInline,
                    multiline: isInlineMultiline(node.type),
                    value: content,
                    placeholder: "Type markdown...",
                    onCommit: handleInlineCommit,
                    onCancel: handleInlineCancel,
                    renderDisplay: (value: string) =>
                        React.createElement(
                            "div",
                            {
                                className: nodeClassName,
                                style: {
                                    fontSize,
                                    fontFamily,
                                    lineHeight,
                                    color: textColor,
                                    padding: "8px 0",
                                    ...style,
                                },
                            },
                            renderMarkdown(value)
                        ),
                });
            }

            case "html": {
                const html = (node.props.content as string) ?? "";
                return React.createElement("div", {
                    className: nodeClassName,
                    style: { padding: "4px 0", ...style },
                    dangerouslySetInnerHTML: { __html: html },
                });
            }

            case "tailwind":
                return React.createElement(
                    "div",
                    {
                        className: nodeClassName,
                        style: {
                            border: "1px dashed #38bdf8",
                            borderRadius: "4px",
                            padding: "4px",
                            ...style,
                        },
                    },
                    renderChildren()
                );

            case "font":
            case "preview":
                return React.createElement(
                    "div",
                    {
                        style: {
                            padding: "6px 10px",
                            background: "#f8fafc",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "#64748b",
                            fontFamily: "monospace",
                        },
                    },
                    node.type === "font"
                        ? `Font: ${(node.props.fontFamily as string) ?? "Unnamed"}`
                        : `Preview: ${(node.props.content as string) ?? "…"}`
                );

            default:
                return React.createElement(
                    "div",
                    { style: { padding: "8px", color: "#94a3b8", fontSize: "12px" } },
                    `[${node.type}]`
                );
        }
    };

    const isDropTarget = isOver && !isDragging;
    const dragProps = isEditingInline ? {} : { ...listeners, ...attributes };
    const handleNodeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(node.id);
        if (editingNodeId && editingNodeId !== node.id) {
            setEditingNodeId(null);
        }
    };

    return React.createElement(
        "div",
        {
            ref: mergedRef,
            className: `oe-canvas-node ${isDragging ? "oe-dragging" : ""} ${isDropTarget ? "oe-drop-target" : ""} ${isEditingInline ? "oe-inline-editing" : ""}`,
            "data-selected": isSelected ? "true" : "false",
            "data-label": label,
            "data-node-id": node.id,
            onClick: handleNodeClick,
            ...dragProps,
        },
        isSelected && isInlineEditable && React.createElement(
            "button",
            {
                type: "button",
                className: "oe-canvas-node-edit-btn oe-btn oe-btn-xs",
                onPointerDown: (e: React.PointerEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                },
                onClick: (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (isEditingInline) {
                        setEditingNodeId(null);
                    } else {
                        setEditingNodeId(node.id);
                    }
                },
            },
            isEditingInline ? "Done" : "Edit"
        ),
        renderContent()
    );
}

function getEmptyLabel(type: string): string {
    switch (type) {
        case "container": return "+ Add component";
        case "section": return "+ Add to section";
        case "row": return "+ Add column";
        case "column": return "+ Add content";
        case "tailwind": return "+ Add component (Tailwind enabled)";
        default: return "+ Drop here";
    }
}

function VisualCanvas() {
    const { document, selectNode } = useEditor();
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const tailwindEnabled = document.meta.tailwind?.enabled ?? false;
    const tailwindConfig = document.meta.tailwind?.config;

    // Re-scan when the document body changes so newly-added or updated
    // components with Tailwind classes get styled without a manual toggle.
    useEffect(() => {
        if (tailwindEnabled) {
            (window as any).tailwind?.scan?.();
        }
    }, [document.body, tailwindEnabled]);

    useEffect(() => {
        const SCRIPT_ID = "oe-tailwind-cdn";

        if (!tailwindEnabled) {
            window.document.getElementById(SCRIPT_ID)?.remove();
            return;
        }

        // Build merged config with preflight disabled so Tailwind doesn't reset
        // the editor's own CSS while still applying utility classes.
        let mergedConfig: Record<string, unknown> = { corePlugins: { preflight: false } };
        if (tailwindConfig) {
            try {
                const parsed = JSON.parse(tailwindConfig) as Record<string, unknown>;
                mergedConfig = {
                    ...parsed,
                    corePlugins: { ...(parsed.corePlugins as object ?? {}), preflight: false },
                };
            } catch { /* ignore malformed JSON */ }
        }

        if (!window.document.getElementById(SCRIPT_ID)) {
            // CDN defines window.tailwind when it loads (overwrites anything
            // set before), so we apply config in onload after it's ready.
            const script = window.document.createElement("script");
            script.id = SCRIPT_ID;
            script.src = "https://cdn.tailwindcss.com";
            script.onload = () => {
                (window as any).tailwind.config = mergedConfig;
                (window as any).tailwind?.scan?.();
            };
            window.document.head.appendChild(script);
        } else if ((window as any).tailwind) {
            // CDN already loaded — update config and force a fresh scan.
            (window as any).tailwind.config = mergedConfig;
            (window as any).tailwind?.scan?.();
        } else {
            // Script tag exists but CDN hasn't finished loading yet — attach
            // another onload listener to apply the config once it's ready.
            const existing = window.document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
            if (existing) {
                existing.addEventListener("load", () => {
                    (window as any).tailwind.config = mergedConfig;
                    (window as any).tailwind?.scan?.();
                }, { once: true });
            }
        }
    }, [tailwindEnabled, tailwindConfig]);

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("a")) e.preventDefault();
        setEditingNodeId(null);
        selectNode(null);
    }, [selectNode]);

    return React.createElement(
        "div",
        { className: "oe-canvas", onClick: handleCanvasClick },
        React.createElement(
            "div",
            { className: "oe-canvas-inner" },
            React.createElement(CanvasNode, {
                node: document.body,
                parentId: "__root__",
                index: 0,
                editingNodeId,
                setEditingNodeId,
            })
        )
    );
}

// ─── Code Mode ───────────────────────────────────────────────────────────────

function CodeCanvas() {
    const { document, setDocument } = useEditor();
    const [code, setCode] = useState(() => exportToJSON(document));
    const [error, setError] = useState<string | null>(null);

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

interface PreviewCanvasProps {
    variableData?: Record<string, string>;
}

function PreviewCanvas({ variableData }: PreviewCanvasProps) {
    const { document } = useEditor();
    const [html, setHtml] = useState<string>("");
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        let cancelled = false;
        renderToHTML(document, variableData).then((result) => {
            if (!cancelled) setHtml(result);
        });
        return () => {
            cancelled = true;
        };
    }, [document, variableData]);

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
            sandbox: "allow-same-origin allow-scripts",
        })
    );
}

export interface EditorCanvasProps {
    className?: string;
    /** Variable values for {{variableName}} interpolation in preview */
    variableData?: Record<string, string>;
}

export function EditorCanvas({ className, variableData }: EditorCanvasProps) {
    const { mode } = useEditor();

    const content = useMemo(() => {
        switch (mode) {
            case "visual":
                return React.createElement(VisualCanvas, null);
            case "code":
                return React.createElement(CodeCanvas, null);
            case "preview":
                return React.createElement(PreviewCanvas, { variableData });
            default:
                return React.createElement(VisualCanvas, null);
        }
    }, [mode, variableData]);

    return content;
}
