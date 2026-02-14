// ─── React Email Renderer ────────────────────────────────────────────────────
// Converts the JSON document schema to React Email component elements.

import React from "react";
import type { EmailDocument, EmailNode, ComponentRegistry } from "../types";
import { defaultRegistry } from "../registry/component-registry";

// React Email component imports — we import them dynamically to keep this flexible
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
} from "@react-email/components";

/** Map node types to React Email components */
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
};

/** Extract style props from flat dotted keys (e.g. "style.color" → { style: { color: ... } }) */
function resolveProps(props: Record<string, unknown>): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};
    const styleObj: Record<string, unknown> = {};

    // List of props that should be moved to style to avoid React warnings
    const STYLE_PROPS = new Set([
        "maxWidth",
        "backgroundColor",
        "color",
        "borderRadius",
        "borderColor",
        "borderWidth",
        "padding",
        "margin",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "lineHeight",
        "textAlign",
        "verticalAlign",
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

    // Merge with existing style prop if present in resolved (though usually it's not)
    // or if passed as a separate object in props
    if (props.style && typeof props.style === "object") {
        Object.assign(styleObj, props.style);
    }

    if (Object.keys(styleObj).length > 0) {
        resolved.style = {
            ...(resolved.style as Record<string, unknown> ?? {}),
            ...styleObj,
        };
    }

    return resolved;
}

/** Render a single node to a React element */
function renderNode(node: EmailNode): React.ReactNode {
    const Component = componentMap[node.type];
    if (!Component) {
        // Unknown component — render as div with warning
        return React.createElement(
            "div",
            { key: node.id, "data-unknown-type": node.type },
            node.children?.map(renderNode)
        );
    }

    const resolvedProps = resolveProps(node.props);

    // Handle components that have text content instead of children
    const { content, text, ...restProps } = resolvedProps as any;

    // Text/Heading use content, Button uses text
    if (node.type === "text" || node.type === "heading" || node.type === "link") {
        return React.createElement(
            Component,
            { key: node.id, ...restProps },
            content ?? ""
        );
    }

    if (node.type === "button") {
        return React.createElement(
            Component,
            { key: node.id, ...restProps },
            text ?? ""
        );
    }

    // Leaf nodes (hr, spacer, image)
    if (!node.children || node.children.length === 0) {
        if (node.type === "spacer") {
            return React.createElement("div", {
                key: node.id,
                style: { height: (resolvedProps.height as string) ?? "20px" },
            });
        }
        return React.createElement(Component, { key: node.id, ...resolvedProps });
    }

    // Layout components with children
    if (node.type === "column") {
        const { style, ...otherProps } = resolvedProps as any;
        const { verticalAlign, width, height, ...otherStyle } = (style || {}) as any;

        return React.createElement(
            Component,
            {
                key: node.id,
                ...otherProps,
                style: { ...otherStyle, verticalAlign }, // Pass verticalAlign in style
                width, // width is valid attribute for td
                height, // height is valid attribute for td
            },
            node.children.map(renderNode)
        );
    }

    if (node.type === "row") {
        const { style, ...otherProps } = resolvedProps as any;
        // Handle simulated gap
        const gap = style?.gap;
        let children: React.ReactNode[] = node.children.map(renderNode);

        if (gap) {
            // Parse gap value (e.g. "10px" -> 10)
            const gapValue = parseInt((gap as string).replace("px", ""), 10);
            if (!isNaN(gapValue) && gapValue > 0) {
                const newChildren: React.ReactNode[] = [];
                children.forEach((child, index) => {
                    newChildren.push(child);
                    if (index < children.length - 1) {
                        // Add spacer cell
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

        // Ensure background color and other styles are passed to Row
        return React.createElement(
            Component,
            {
                key: node.id,
                ...otherProps,
                style: { ...style, gap: undefined }, // Remove gap from style prop as it's not supported
            },
            children
        );
    }

    return React.createElement(
        Component,
        { key: node.id, ...resolvedProps },
        node.children.map(renderNode)
    );
}

/**
 * Convert an EmailDocument into a React Email element tree.
 * Returns a full <Html><Head/><Preview/><Body>...</Body></Html> element.
 */
export function renderToReactEmail(document: EmailDocument): React.ReactElement {
    const bodyContent = renderNode(document.body);

    return React.createElement(
        Html,
        { lang: "en", dir: "ltr" },
        React.createElement(Head, null),
        document.meta.previewText
            ? React.createElement(Preview, null, document.meta.previewText)
            : null,
        React.createElement(
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
        )
    );
}
