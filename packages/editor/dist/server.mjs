// src/renderer/html-renderer.ts
import { render } from "@react-email/render";

// src/renderer/react-email-renderer.ts
import React from "react";

// src/utils/variable-interpolation.ts
var VARIABLE_PATTERN = /\{\{(\w+)\}\}/g;
function interpolateVariables(content, variableData, variableDefinitions) {
  if (typeof content !== "string") return "";
  const defs = variableDefinitions ?? {};
  const data = variableData ?? {};
  return content.replace(VARIABLE_PATTERN, (_, key) => {
    if (data[key] !== void 0 && data[key] !== "") return data[key];
    return defs[key]?.fallback ?? "";
  });
}
function hasVariables(content) {
  return typeof content === "string" && VARIABLE_PATTERN.test(content);
}
function extractVariableNames(content) {
  if (typeof content !== "string") return [];
  const names = /* @__PURE__ */ new Set();
  let match;
  const re = new RegExp(VARIABLE_PATTERN);
  while ((match = re.exec(content)) !== null) {
    names.add(match[1]);
  }
  return Array.from(names);
}

// src/renderer/react-email-renderer.ts
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
  Preview
} from "@react-email/components";
var componentMap = {
  container: Container,
  section: Section,
  row: Row,
  column: Column,
  text: Text,
  heading: Heading,
  button: Button,
  image: Img,
  link: Link,
  hr: Hr
};
function resolveProps(props) {
  const resolved = {};
  const styleObj = {};
  const STYLE_PROPS = /* @__PURE__ */ new Set([
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
    "verticalAlign"
  ]);
  for (const [key, value] of Object.entries(props)) {
    if (value === void 0 || value === null || value === "") continue;
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
      ...resolved.style ?? {},
      ...styleObj
    };
  }
  return resolved;
}
function interpolate(ctx, value) {
  if (value == null) return "";
  return interpolateVariables(value, ctx.variableData, ctx.variableDefinitions);
}
function renderNode(node, ctx) {
  if (node.type === "spacer") {
    const resolvedProps2 = resolveProps(node.props);
    const h = resolvedProps2.height ?? "20px";
    return React.createElement(
      Section,
      { key: node.id },
      React.createElement("div", {
        style: { height: h, lineHeight: h, fontSize: "1px" }
      }, "\xA0")
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
  const { content, text, ...restProps } = resolvedProps;
  if (node.type === "text" || node.type === "heading" || node.type === "link") {
    return React.createElement(
      Component,
      { key: node.id, ...restProps },
      interpolate(ctx, content)
    );
  }
  if (node.type === "button") {
    return React.createElement(
      Component,
      { key: node.id, ...restProps },
      interpolate(ctx, text)
    );
  }
  if (!node.children || node.children.length === 0) {
    return React.createElement(Component, { key: node.id, ...resolvedProps });
  }
  if (node.type === "column") {
    const { style, ...otherProps } = resolvedProps;
    const { verticalAlign, width, height, ...otherStyle } = style || {};
    return React.createElement(
      Component,
      {
        key: node.id,
        ...otherProps,
        style: { ...otherStyle, verticalAlign },
        width,
        height
      },
      node.children.map((c) => renderNode(c, ctx))
    );
  }
  if (node.type === "row") {
    const { style, ...otherProps } = resolvedProps;
    const gap = style?.gap;
    let children = node.children.map((c) => renderNode(c, ctx));
    if (gap) {
      const gapValue = parseInt(gap.replace("px", ""), 10);
      if (!isNaN(gapValue) && gapValue > 0) {
        const newChildren = [];
        children.forEach((child, index) => {
          newChildren.push(child);
          if (index < children.length - 1) {
            newChildren.push(
              React.createElement("td", {
                key: `spacer-${index}`,
                width: gapValue,
                style: { fontSize: 0, lineHeight: 0 }
              }, "\xA0")
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
        style: { ...style, gap: void 0 }
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
function renderToReactEmail(document, variableData) {
  const ctx = {
    variableData,
    variableDefinitions: document.variables
  };
  const bodyContent = renderNode(document.body, ctx);
  return React.createElement(
    Html,
    { lang: "en", dir: "ltr" },
    React.createElement(Head, null),
    document.meta.previewText ? React.createElement(Preview, null, document.meta.previewText) : null,
    React.createElement(
      Body,
      {
        style: {
          backgroundColor: "#f6f9fc",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
          margin: "0",
          padding: "0"
        }
      },
      bodyContent
    )
  );
}

// src/renderer/html-renderer.ts
async function renderToHTML(document, variableData) {
  const element = renderToReactEmail(document, variableData);
  const html = await render(element);
  return html;
}
async function renderToPlainText(document, variableData) {
  const element = renderToReactEmail(document, variableData);
  const text = await render(element, { plainText: true });
  return text;
}
export {
  extractVariableNames,
  hasVariables,
  interpolateVariables,
  renderToHTML,
  renderToPlainText,
  renderToReactEmail
};
//# sourceMappingURL=server.mjs.map