import React from "react";
import type { EmailDocument, EmailNode } from "../types";
import { interpolateVariables } from "../utils/variable-interpolation";

import {
    Html,
    Body,
    Container,
    Section,
    Row,
    Column,
    Text,
    Heading,
    Button,
    Img,
    Link,
    Hr,
    Head,
    Preview,
    CodeBlock,
    CodeInline,
    Markdown,
    Font,
} from "@react-email/components";
import { xonokai } from "@react-email/code-block";

const componentMap: Record<string, React.ComponentType<any>> = {
    container: Container,
    section: Section,
    row: Row,
    column: Column,
    text: Text,
    heading: Heading,
    button: Button,
    image: Img,
    link: Link,
    hr: Hr,
    "code-block": CodeBlock,
    "code-inline": CodeInline,
    markdown: Markdown,
    font: Font,
};

function resolveProps(props: Record<string, unknown>): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};
    const styleObj: Record<string, unknown> = {};

    const STYLE_PROPS = new Set([
        "maxWidth",
        "backgroundColor",
        "color",
        "borderRadius",
        "borderColor",
        "borderWidth",
        "borderStyle",
        "padding",
        "margin",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "fontStyle",
        "lineHeight",
        "textAlign",
        "textDecoration",
        "verticalAlign",
        "width",
        "height",
    ]);

    for (const [key, value] of Object.entries(props)) {
        if (value === undefined || value === null || value === "") continue;

        if (key.startsWith("style.")) {
            const styleProp = key.slice(6);
            styleObj[styleProp] = value;
        } else if (STYLE_PROPS.has(key)) {
            styleObj[key] = value;
        } else {
            resolved[key] = value;
        }
    }

    if (props.style && typeof props.style === "object") {
        Object.assign(styleObj, props.style);
    }

    if (Object.keys(styleObj).length > 0) {
        resolved.style = {
            ...((resolved.style as Record<string, unknown>) ?? {}),
            ...styleObj,
        };
    }

    return resolved;
}
type RenderContext = {
    variableData?: Record<string, string>;
    variableDefinitions?: Record<string, { fallback: string }>;
};

function interpolate(ctx: RenderContext, value: string | undefined): string {
    if (value == null) return "";
    return interpolateVariables(value, ctx.variableData, ctx.variableDefinitions);
}

function renderNode(node: EmailNode, ctx: RenderContext): React.ReactNode {
    if (node.type === "html") {
        const raw = interpolate(ctx, (node.props.content as string | undefined));
        return React.createElement("div", {
            key: node.id,
            dangerouslySetInnerHTML: { __html: raw },
        });
    }

    if (node.type === "spacer") {
        const resolvedProps = resolveProps(node.props);
        const h = (resolvedProps.height as string) ?? "20px";
        return React.createElement(
            Section,
            { key: node.id },
            React.createElement("div", {
                style: { height: h, lineHeight: h, fontSize: "1px" },
            }, "\u00A0")
        );
    }

    const Component = componentMap[node.type];
    if (!Component) {
        return React.createElement(
            "div",
            { key: node.id, "data-unknown-type": node.type },
            node.children?.map((c) => renderNode(c, ctx))
        );
    }

    const resolvedProps = resolveProps(node.props);
    const { content, text, code, ...restProps } = resolvedProps as any;

    if (node.type === "text" || node.type === "heading" || node.type === "link") {
        return React.createElement(
            Component,
            { key: node.id, ...restProps },
            interpolate(ctx, content as string | undefined)
        );
    }

    if (node.type === "markdown") {
        const { style, ...markdownProps } = restProps as any;
        return React.createElement(
            Component,
            {
                key: node.id,
                markdownContainerStyles: style,
                ...markdownProps
            },
            interpolate(ctx, content as string | undefined) || ""
        );
    }

    if (node.type === "button") {
        return React.createElement(
            Component,
            { key: node.id, ...restProps },
            interpolate(ctx, text as string | undefined)
        );
    }

    if (node.type === "code-block") {
        const { language, theme, ...codeBlockProps } = resolvedProps as any;
        return React.createElement(
            Component,
            {
                key: node.id,
                code: interpolate(ctx, code as string | undefined) || "",
                language: language || "text",
                theme: theme || xonokai,
                ...codeBlockProps
            }
        );
    }

    if (node.type === "code-inline") {
        return React.createElement(
            Component,
            { key: node.id, code: interpolate(ctx, code as string | undefined), ...restProps }
        );
    }

    if (node.type === "font") {
        const { webFontUrl, webFontFormat, ...fontProps } = resolvedProps as any;
        const webFont = webFontUrl && webFontFormat
            ? { url: webFontUrl, format: webFontFormat }
            : undefined;
        return React.createElement(
            Component,
            { key: node.id, ...fontProps, webFont }
        );
    }

    if (node.type === "preview") {
        return React.createElement(
            Component,
            { key: node.id },
            interpolate(ctx, content as string | undefined)
        );
    }

    if (node.type === "tailwind") {
        let config: Record<string, unknown> | undefined;
        const rawConfig = node.props.config;
        if (rawConfig && typeof rawConfig === "string") {
            try {
                config = JSON.parse(rawConfig);
            } catch {
                config = undefined;
            }
        } else if (rawConfig && typeof rawConfig === "object") {
            config = rawConfig as Record<string, unknown>;
        }
        return React.createElement(
            Component,
            { key: node.id, ...(config ? { config } : {}) },
            node.children?.map((c) => renderNode(c, ctx))
        );
    }

    if (!node.children || node.children.length === 0) {
        return React.createElement(Component, { key: node.id, ...resolvedProps });
    }

    if (node.type === "column") {
        const { style, ...otherProps } = resolvedProps as any;
        const { verticalAlign, width, height, ...otherStyle } = (style || {}) as any;

        return React.createElement(
            Component,
            {
                key: node.id,
                ...otherProps,
                style: { ...otherStyle, verticalAlign },
                width,
                height,
            },
            node.children.map((c) => renderNode(c, ctx))
        );
    }

    if (node.type === "row") {
        const { style, ...otherProps } = resolvedProps as any;
        const gap = style?.gap;
        let children: React.ReactNode[] = node.children.map((childNode) => {
            const renderedChild = renderNode(childNode, ctx);
            if (childNode.type === "column") {
                return renderedChild;
            }
            return React.createElement(
                Column,
                { key: `auto-column-${childNode.id}` },
                renderedChild
            );
        });

        if (gap) {
            const gapValue = parseInt((gap as string).replace("px", ""), 10);
            if (!isNaN(gapValue) && gapValue > 0) {
                const newChildren: React.ReactNode[] = [];
                children.forEach((child, index) => {
                    newChildren.push(child);
                    if (index < children.length - 1) {
                        newChildren.push(
                            React.createElement("td", {
                                key: `spacer-${index}`,
                                width: gapValue,
                                style: { fontSize: 0, lineHeight: 0 }
                            }, "\u00A0")
                        );
                    }
                });
                children = newChildren;
            }
        }

        return React.createElement(
            Component,
            {
                key: node.id,
                ...otherProps,
                style: { ...style, gap: undefined },
            },
            children
        );
    }

    return React.createElement(
        Component,
        { key: node.id, ...resolvedProps },
        node.children.map((c) => renderNode(c, ctx))
    );
}

export function renderToReactEmail(
    document: EmailDocument,
    variableData?: Record<string, string>
): React.ReactElement {
    const ctx: RenderContext = {
        variableData,
        variableDefinitions: document.variables,
    };
    const bodyContent = renderNode(document.body, ctx);

    const bodyElement = React.createElement(
        Body,
        {
            style: {
                backgroundColor: "#f6f9fc",
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
                margin: "0",
                padding: "0",
            },
        },
        bodyContent
    );

    const fontElements = (document.meta.fonts ?? [])
        .filter((f) => f.fontFamily)
        .map((f, i) =>
            React.createElement(Font as any, {
                key: `font-${i}`,
                fontFamily: f.fontFamily,
                fallbackFontFamily: f.fallbackFontFamily || "sans-serif",
                ...(f.webFontUrl && f.webFontFormat
                    ? { webFont: { url: f.webFontUrl, format: f.webFontFormat } }
                    : {}),
                ...(f.fontWeight ? { fontWeight: f.fontWeight } : {}),
                ...(f.fontStyle ? { fontStyle: f.fontStyle } : {}),
            })
        );

    // Tailwind CSS is injected via CDN in renderToHTML for the preview, and should
    // be handled server-side by the consuming app for production email sending.
    // The React Email Tailwind wrapper is intentionally NOT used here — it injects
    // its own <style> block with base CSS resets that break the email layout.
    return React.createElement(
        Html,
        { lang: "en", dir: "ltr" },
        React.createElement(Head, null, ...fontElements),
        document.meta.previewText
            ? React.createElement(Preview, null, document.meta.previewText)
            : null,
        bodyElement
    );
}
