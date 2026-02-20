import type { ComponentDefinition, ComponentRegistry, EmailNodeType } from "../types";

export function createRegistry(definitions: ComponentDefinition[]): ComponentRegistry {
  const registry = new Map<EmailNodeType, ComponentDefinition>();
  for (const def of definitions) {
    registry.set(def.type, def);
  }
  return registry;
}

export function mergeRegistries(
  base: ComponentRegistry,
  overrides: ComponentDefinition[]
): ComponentRegistry {
  const merged = new Map(base);
  for (const def of overrides) {
    merged.set(def.type, def);
  }
  return merged;
}

const defaultDefinitions: ComponentDefinition[] = [
  {
    type: "container",
    label: "Container",
    icon: "box",
    category: "layout",
    description: "Centers content with max-width constraint",
    defaultProps: { maxWidth: "600px" },
    acceptsChildren: true,
    properties: [
      {
        key: "maxWidth",
        label: "Max Width",
        type: "text",
        defaultValue: "600px",
        group: "layout",
        placeholder: "e.g. 600px",
      },
      {
        key: "style.backgroundColor",
        label: "Background",
        type: "color",
        group: "style",
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 20px",
      },
      {
        key: "style.margin",
        label: "Margin",
        type: "text",
        group: "layout",
        placeholder: "e.g. 0 auto",
      },
      {
        key: "style.borderWidth",
        label: "Border Width",
        type: "text",
        group: "style",
        placeholder: "e.g. 1px",
      },
      {
        key: "style.borderColor",
        label: "Border Color",
        type: "color",
        group: "style",
      },
      {
        key: "style.borderRadius",
        label: "Border Radius",
        type: "text",
        group: "style",
        placeholder: "e.g. 4px",
      },
    ],
  },
  {
    type: "section",
    label: "Section",
    icon: "layout",
    category: "layout",
    description: "Groups content into a section",
    defaultProps: {},
    acceptsChildren: true,
    properties: [
      {
        key: "style.backgroundColor",
        label: "Background",
        type: "color",
        group: "style",
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 20px 0",
      },
      {
        key: "style.margin",
        label: "Margin",
        type: "text",
        group: "layout",
        placeholder: "e.g. 0",
      },
      {
        key: "style.borderWidth",
        label: "Border Width",
        type: "text",
        group: "style",
        placeholder: "e.g. 1px",
      },
      {
        key: "style.borderColor",
        label: "Border Color",
        type: "color",
        group: "style",
      },
      {
        key: "style.borderRadius",
        label: "Border Radius",
        type: "text",
        group: "style",
        placeholder: "e.g. 4px",
      },
      {
        key: "style.width",
        label: "Width",
        type: "text",
        group: "layout",
        placeholder: "e.g. 100%",
      },
    ],
  },
  {
    type: "row",
    label: "Row",
    icon: "columns",
    category: "layout",
    description: "Horizontal row for multi-column layouts",
    defaultProps: {},
    acceptsChildren: true,
    allowedChildTypes: ["column"],
    properties: [
      {
        key: "style.backgroundColor",
        label: "Background",
        type: "color",
        group: "style",
      },
      {
        key: "style.height",
        label: "Height",
        type: "text",
        group: "layout",
        placeholder: "e.g. 50px",
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px",
      },
      {
        key: "style.margin",
        label: "Margin",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px",
      },
      {
        key: "style.gap",
        label: "Gap",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px (simulated)",
      },
    ],
  },
  {
    type: "column",
    label: "Column",
    icon: "sidebar",
    category: "layout",
    description: "Column inside a row",
    defaultProps: {},
    acceptsChildren: true,
    properties: [
      {
        key: "style.width",
        label: "Width",
        type: "text",
        group: "layout",
        placeholder: "e.g. 50%, 300px",
      },
      {
        key: "style.height",
        label: "Height",
        type: "text",
        group: "layout",
        placeholder: "e.g. 50px",
      },
      {
        key: "style.verticalAlign",
        label: "Vertical Align",
        type: "select",
        options: [
          { label: "Top", value: "top" },
          { label: "Middle", value: "middle" },
          { label: "Bottom", value: "bottom" },
        ],
        group: "layout",
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px",
      },
      {
        key: "style.margin",
        label: "Margin",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px",
      },
      {
        key: "style.backgroundColor",
        label: "Background",
        type: "color",
        group: "style",
      },
      {
        key: "style.borderWidth",
        label: "Border Width",
        type: "text",
        group: "style",
        placeholder: "e.g. 1px",
      },
      {
        key: "style.borderColor",
        label: "Border Color",
        type: "color",
        group: "style",
      },
      {
        key: "style.borderRadius",
        label: "Border Radius",
        type: "text",
        group: "style",
        placeholder: "e.g. 4px",
      },
    ],
  },

  {
    type: "text",
    label: "Text",
    icon: "type",
    category: "content",
    description: "Paragraph text block",
    defaultProps: { content: "Type your text here..." },
    acceptsChildren: false,
    properties: [
      {
        key: "content",
        label: "Content",
        type: "textarea",
        defaultValue: "Type your text here...",
        group: "content",
      },
      {
        key: "style.fontSize",
        label: "Font Size",
        type: "text",
        group: "style",
        placeholder: "e.g. 16px",
      },
      {
        key: "style.fontWeight",
        label: "Font Weight",
        type: "select",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Medium", value: "500" },
          { label: "Semi Bold", value: "600" },
          { label: "Bold", value: "bold" },
        ],
        group: "style",
      },
      {
        key: "style.color",
        label: "Color",
        type: "color",
        group: "style",
      },
      {
        key: "style.textAlign",
        label: "Alignment",
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
        group: "style",
      },
      {
        key: "style.lineHeight",
        label: "Line Height",
        type: "text",
        group: "style",
        placeholder: "e.g. 1.6",
      },
      {
        key: "style.fontFamily",
        label: "Font Family",
        type: "text",
        group: "style",
        placeholder: "e.g. Arial, sans-serif",
      },
    ],
  },
  {
    type: "heading",
    label: "Heading",
    icon: "heading",
    category: "content",
    description: "Heading text (H1–H6)",
    defaultProps: { content: "Heading", as: "h2" },
    acceptsChildren: false,
    properties: [
      {
        key: "content",
        label: "Content",
        type: "text",
        defaultValue: "Heading",
        group: "content",
      },
      {
        key: "as",
        label: "Level",
        type: "select",
        defaultValue: "h2",
        options: [
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
          { label: "H4", value: "h4" },
          { label: "H5", value: "h5" },
          { label: "H6", value: "h6" },
        ],
        group: "content",
      },
      {
        key: "style.color",
        label: "Color",
        type: "color",
        group: "style",
      },
      {
        key: "style.textAlign",
        label: "Alignment",
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
        group: "style",
      },
      {
        key: "style.fontFamily",
        label: "Font Family",
        type: "text",
        group: "style",
        placeholder: "e.g. Arial, sans-serif",
      },
    ],
  },
  {
    type: "button",
    label: "Button",
    icon: "mouse-pointer",
    category: "content",
    description: "Call-to-action button with link",
    defaultProps: {
      text: "Click me",
      href: "https://example.com",
      backgroundColor: "#5046e5",
      color: "#ffffff",
      borderRadius: "6px",
      padding: "12px 24px",
    },
    acceptsChildren: false,
    properties: [
      {
        key: "text",
        label: "Text",
        type: "text",
        defaultValue: "Click me",
        group: "content",
      },
      {
        key: "href",
        label: "URL",
        type: "url",
        group: "content",
        placeholder: "https://...",
      },
      {
        key: "backgroundColor",
        label: "Background",
        type: "color",
        defaultValue: "#5046e5",
        group: "style",
      },
      {
        key: "color",
        label: "Text Color",
        type: "color",
        defaultValue: "#ffffff",
        group: "style",
      },
      {
        key: "borderRadius",
        label: "Border Radius",
        type: "text",
        defaultValue: "6px",
        group: "style",
        placeholder: "e.g. 6px",
      },
      {
        key: "padding",
        label: "Padding",
        type: "text",
        defaultValue: "12px 24px",
        group: "style",
        placeholder: "e.g. 12px 24px",
      },
      {
        key: "style.fontSize",
        label: "Font Size",
        type: "text",
        group: "style",
        placeholder: "e.g. 16px",
      },
      {
        key: "style.fontWeight",
        label: "Font Weight",
        type: "select",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Medium", value: "500" },
          { label: "Semi Bold", value: "600" },
          { label: "Bold", value: "bold" },
        ],
        group: "style",
      },
      {
        key: "style.fontFamily",
        label: "Font Family",
        type: "text",
        group: "style",
        placeholder: "e.g. Arial, sans-serif",
      },
      {
        key: "style.borderWidth",
        label: "Border Width",
        type: "text",
        group: "style",
        placeholder: "e.g. 1px",
      },
      {
        key: "style.borderColor",
        label: "Border Color",
        type: "color",
        group: "style",
      },
      {
        key: "style.borderStyle",
        label: "Border Style",
        type: "select",
        options: [
          { label: "Solid", value: "solid" },
          { label: "Dashed", value: "dashed" },
          { label: "Dotted", value: "dotted" },
          { label: "None", value: "none" },
        ],
        group: "style",
      },
      {
        key: "style.textAlign",
        label: "Alignment",
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
        group: "style",
      },
      {
        key: "style.textDecoration",
        label: "Text Decoration",
        type: "select",
        options: [
          { label: "None", value: "none" },
          { label: "Underline", value: "underline" },
          { label: "Overline", value: "overline" },
          { label: "Line Through", value: "line-through" },
        ],
        group: "style",
      },
    ],
  },
  {
    type: "image",
    label: "Image",
    icon: "image",
    category: "content",
    description: "Image with alt text",
    defaultProps: {
      src: "https://placehold.co/600x200/e2e8f0/64748b?text=Image",
      alt: "Image",
      width: 600,
    },
    acceptsChildren: false,
    properties: [
      {
        key: "src",
        label: "Source URL",
        type: "url",
        group: "content",
        placeholder: "https://...",
      },
      {
        key: "alt",
        label: "Alt Text",
        type: "text",
        group: "content",
        placeholder: "Describe the image",
      },
      {
        key: "width",
        label: "Width (px)",
        type: "number",
        group: "layout",
      },
      {
        key: "height",
        label: "Height (px)",
        type: "number",
        group: "layout",
      },
      {
        key: "style.borderRadius",
        label: "Border Radius",
        type: "text",
        group: "style",
        placeholder: "e.g. 4px",
      },
      {
        key: "style.borderWidth",
        label: "Border Width",
        type: "text",
        group: "style",
        placeholder: "e.g. 1px",
      },
      {
        key: "style.borderColor",
        label: "Border Color",
        type: "color",
        group: "style",
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px",
      },
      {
        key: "style.margin",
        label: "Margin",
        type: "text",
        group: "layout",
        placeholder: "e.g. 10px",
      },
    ],
  },
  {
    type: "link",
    label: "Link",
    icon: "external-link",
    category: "content",
    description: "Hyperlink text",
    defaultProps: {
      content: "Click here",
      href: "https://example.com",
      color: "#5046e5",
    },
    acceptsChildren: false,
    properties: [
      {
        key: "content",
        label: "Text",
        type: "text",
        defaultValue: "Click here",
        group: "content",
      },
      {
        key: "href",
        label: "URL",
        type: "url",
        group: "content",
        placeholder: "https://...",
      },
      {
        key: "color",
        label: "Color",
        type: "color",
        defaultValue: "#5046e5",
        group: "style",
      },
      {
        key: "style.fontSize",
        label: "Font Size",
        type: "text",
        group: "style",
        placeholder: "e.g. 16px",
      },
      {
        key: "style.fontWeight",
        label: "Font Weight",
        type: "select",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Medium", value: "500" },
          { label: "Semi Bold", value: "600" },
          { label: "Bold", value: "bold" },
        ],
        group: "style",
      },
      {
        key: "style.fontFamily",
        label: "Font Family",
        type: "text",
        group: "style",
        placeholder: "e.g. Arial, sans-serif",
      },
      {
        key: "style.textDecoration",
        label: "Text Decoration",
        type: "select",
        options: [
          { label: "None", value: "none" },
          { label: "Underline", value: "underline" },
          { label: "Overline", value: "overline" },
          { label: "Line Through", value: "line-through" },
        ],
        group: "style",
      },
      {
        key: "style.textAlign",
        label: "Alignment",
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
        group: "style",
      },
    ],
  },

  {
    type: "hr",
    label: "Divider",
    icon: "minus",
    category: "utility",
    description: "Horizontal divider line",
    defaultProps: {
      borderColor: "#e2e8f0",
      borderWidth: "1px",
    },
    acceptsChildren: false,
    properties: [
      {
        key: "borderColor",
        label: "Color",
        type: "color",
        defaultValue: "#e2e8f0",
        group: "style",
      },
      {
        key: "borderWidth",
        label: "Width",
        type: "text",
        defaultValue: "1px",
        group: "style",
        placeholder: "e.g. 1px",
      },
    ],
  },
  {
    type: "spacer",
    label: "Spacer",
    icon: "move-vertical",
    category: "utility",
    description: "Vertical space between elements",
    defaultProps: { height: "20px" },
    acceptsChildren: false,
    properties: [
      {
        key: "height",
        label: "Height",
        type: "text",
        defaultValue: "20px",
        group: "layout",
        placeholder: "e.g. 20px, 2em",
      },
    ],
  },
  {
    type: "code-block",
    label: "Code Block",
    icon: "code",
    category: "content",
    description: "Code block with syntax highlighting",
    defaultProps: {
      code: "console.log('Hello, World!');",
      language: "javascript",
    },
    acceptsChildren: false,
    properties: [
      {
        key: "code",
        label: "Code",
        type: "textarea",
        defaultValue: "console.log('Hello, World!');",
        group: "content",
        placeholder: "Enter your code...",
      },
      {
        key: "language",
        label: "Language",
        type: "select",
        defaultValue: "javascript",
        options: [
          { label: "JavaScript", value: "javascript" },
          { label: "TypeScript", value: "typescript" },
          { label: "HTML", value: "html" },
          { label: "CSS", value: "css" },
          { label: "JSON", value: "json" },
          { label: "Python", value: "python" },
          { label: "Bash", value: "bash" },
          { label: "Plain Text", value: "text" },
        ],
        group: "content",
      },
      {
        key: "style.backgroundColor",
        label: "Background",
        type: "color",
        group: "style",
      },
      {
        key: "style.color",
        label: "Text Color",
        type: "color",
        group: "style",
      },
      {
        key: "style.fontFamily",
        label: "Font Family",
        type: "text",
        group: "style",
        placeholder: "e.g. 'Courier New', monospace",
      },
      {
        key: "style.fontSize",
        label: "Font Size",
        type: "text",
        group: "style",
        placeholder: "e.g. 14px",
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 16px",
      },
      {
        key: "style.borderRadius",
        label: "Border Radius",
        type: "text",
        group: "style",
        placeholder: "e.g. 4px",
      },
    ],
  },
  {
    type: "code-inline",
    label: "Inline Code",
    icon: "code",
    category: "content",
    description: "Inline code snippet",
    defaultProps: {
      code: "const x = 1;",
    },
    acceptsChildren: false,
    properties: [
      {
        key: "code",
        label: "Code",
        type: "text",
        defaultValue: "const x = 1;",
        group: "content",
        placeholder: "Enter code...",
      },
      {
        key: "style.backgroundColor",
        label: "Background",
        type: "color",
        group: "style",
      },
      {
        key: "style.color",
        label: "Text Color",
        type: "color",
        group: "style",
      },
      {
        key: "style.fontFamily",
        label: "Font Family",
        type: "text",
        group: "style",
        placeholder: "e.g. 'Courier New', monospace",
      },
      {
        key: "style.fontSize",
        label: "Font Size",
        type: "text",
        group: "style",
        placeholder: "e.g. 14px",
      },
      {
        key: "style.padding",
        label: "Padding",
        type: "text",
        group: "layout",
        placeholder: "e.g. 2px 4px",
      },
      {
        key: "style.borderRadius",
        label: "Border Radius",
        type: "text",
        group: "style",
        placeholder: "e.g. 3px",
      },
    ],
  },
  {
    type: "markdown",
    label: "Markdown",
    icon: "file-text",
    category: "content",
    description: "Markdown content renderer",
    defaultProps: {
      content: "# Hello World\n\nThis is **markdown** content.",
    },
    acceptsChildren: false,
    properties: [
      {
        key: "content",
        label: "Markdown Content",
        type: "textarea",
        defaultValue: "# Hello World\n\nThis is **markdown** content.",
        group: "content",
        placeholder: "Enter markdown...",
      },
      {
        key: "style.color",
        label: "Text Color",
        type: "color",
        group: "style",
      },
      {
        key: "style.fontSize",
        label: "Font Size",
        type: "text",
        group: "style",
        placeholder: "e.g. 16px",
      },
      {
        key: "style.fontFamily",
        label: "Font Family",
        type: "text",
        group: "style",
        placeholder: "e.g. Arial, sans-serif",
      },
      {
        key: "style.lineHeight",
        label: "Line Height",
        type: "text",
        group: "style",
        placeholder: "e.g. 1.6",
      },
    ],
  },
  {
    type: "html",
    label: "Raw HTML",
    description: "Embed any custom HTML markup directly into the email.",
    icon: "code-xml",
    category: "content",
    defaultProps: {
      content: '<a href="https://example.com">Click here</a>',
    },
    acceptsChildren: false,
    properties: [
      {
        key: "content",
        label: "HTML",
        type: "textarea",
        defaultValue: '<a href="https://example.com">Click here</a>',
        group: "content",
        placeholder: "Enter any valid HTML…",
      },
    ],
  },
];
// Note: "font", "preview", and "tailwind" are intentionally excluded from the
// component palette — they are document-level settings in Document Settings.

const CLASS_NAME_PROP = {
  key: "className",
  label: "CSS Classes",
  type: "text" as const,
  group: "style" as const,
  placeholder: "e.g. bg-blue-500 text-white rounded (requires Tailwind wrapper)",
};

export const defaultRegistry: ComponentRegistry = createRegistry(
  defaultDefinitions.map((def) => ({
    ...def,
    properties: [...def.properties, CLASS_NAME_PROP],
  })),
);

export function getComponentsByCategory(
  registry: ComponentRegistry
): Record<string, ComponentDefinition[]> {
  const result: Record<string, ComponentDefinition[]> = {};
  for (const def of registry.values()) {
    if (!result[def.category]) {
      result[def.category] = [];
    }
    result[def.category].push(def);
  }
  return result;
}

export function getComponentDef(
  registry: ComponentRegistry,
  type: EmailNodeType
): ComponentDefinition | undefined {
  return registry.get(type);
}
