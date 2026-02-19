"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server.ts
var server_exports = {};
__export(server_exports, {
  extractVariableNames: () => extractVariableNames,
  hasVariables: () => hasVariables,
  interpolateVariables: () => interpolateVariables,
  renderToHTML: () => renderToHTML,
  renderToPlainText: () => renderToPlainText,
  renderToReactEmail: () => renderToReactEmail
});
module.exports = __toCommonJS(server_exports);

// src/renderer/html-renderer.ts
var import_render = require("@react-email/render");

// src/renderer/react-email-renderer.ts
var import_react = __toESM(require("react"));

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
var import_components = require("@react-email/components");
var componentMap = {
  container: import_components.Container,
  section: import_components.Section,
  row: import_components.Row,
  column: import_components.Column,
  text: import_components.Text,
  heading: import_components.Heading,
  button: import_components.Button,
  image: import_components.Img,
  link: import_components.Link,
  hr: import_components.Hr
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
    return import_react.default.createElement(
      import_components.Section,
      { key: node.id },
      import_react.default.createElement("div", {
        style: { height: h, lineHeight: h, fontSize: "1px" }
      }, "\xA0")
    );
  }
  const Component = componentMap[node.type];
  if (!Component) {
    return import_react.default.createElement(
      "div",
      { key: node.id, "data-unknown-type": node.type },
      node.children?.map((c) => renderNode(c, ctx))
    );
  }
  const resolvedProps = resolveProps(node.props);
  const { content, text, ...restProps } = resolvedProps;
  if (node.type === "text" || node.type === "heading" || node.type === "link") {
    return import_react.default.createElement(
      Component,
      { key: node.id, ...restProps },
      interpolate(ctx, content)
    );
  }
  if (node.type === "button") {
    return import_react.default.createElement(
      Component,
      { key: node.id, ...restProps },
      interpolate(ctx, text)
    );
  }
  if (!node.children || node.children.length === 0) {
    return import_react.default.createElement(Component, { key: node.id, ...resolvedProps });
  }
  if (node.type === "column") {
    const { style, ...otherProps } = resolvedProps;
    const { verticalAlign, width, height, ...otherStyle } = style || {};
    return import_react.default.createElement(
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
              import_react.default.createElement("td", {
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
    return import_react.default.createElement(
      Component,
      {
        key: node.id,
        ...otherProps,
        style: { ...style, gap: void 0 }
      },
      children
    );
  }
  return import_react.default.createElement(
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
  return import_react.default.createElement(
    import_components.Html,
    { lang: "en", dir: "ltr" },
    import_react.default.createElement(import_components.Head, null),
    document.meta.previewText ? import_react.default.createElement(import_components.Preview, null, document.meta.previewText) : null,
    import_react.default.createElement(
      import_components.Body,
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
  const html = await (0, import_render.render)(element);
  return html;
}
async function renderToPlainText(document, variableData) {
  const element = renderToReactEmail(document, variableData);
  const text = await (0, import_render.render)(element, { plainText: true });
  return text;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractVariableNames,
  hasVariables,
  interpolateVariables,
  renderToHTML,
  renderToPlainText,
  renderToReactEmail
});
//# sourceMappingURL=server.js.map