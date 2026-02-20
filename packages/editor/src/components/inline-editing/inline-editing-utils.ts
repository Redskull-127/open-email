import type { EmailNodeType } from "../../types";

const INLINE_EDITABLE_NODE_TYPES = ["text", "heading", "markdown"] as const;
type InlineEditableNodeType = (typeof INLINE_EDITABLE_NODE_TYPES)[number];

const INLINE_EDITABLE_NODE_TYPE_SET = new Set<EmailNodeType>(
  INLINE_EDITABLE_NODE_TYPES,
);

export function isInlineEditableNodeType(
  type: EmailNodeType,
): type is InlineEditableNodeType {
  return INLINE_EDITABLE_NODE_TYPE_SET.has(type);
}

export function getInlineContentKey(
  type: EmailNodeType,
): "content" | null {
  if (!isInlineEditableNodeType(type)) return null;
  return "content";
}

export function isInlineMultiline(type: EmailNodeType): boolean {
  return type !== "heading";
}
