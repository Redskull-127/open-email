export const CONTENT_NODE_TYPES = ["text", "heading", "link", "button"] as const;
export const CONTENT_KEY: Record<(typeof CONTENT_NODE_TYPES)[number], string> = {
  text: "content",
  heading: "content",
  link: "content",
  button: "text",
};

export const VARIABLE_KEY_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export function isValidVariableKey(key: string): boolean {
  return key.length > 0 && VARIABLE_KEY_REGEX.test(key);
}

export function resolveValue(props: Record<string, unknown>, key: string): unknown {
  if (key.includes(".")) {
    const parts = key.split(".");
    let current: unknown = props;
    for (const part of parts) {
      if (current && typeof current === "object") {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return current;
  }
  return props[key];
}

export const GROUP_LABELS: Record<string, string> = {
  content: "Content",
  layout: "Layout",
  style: "Style",
};

export const GROUP_ORDER = ["content", "layout", "style"] as const;
