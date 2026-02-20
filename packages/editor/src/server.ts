/**
 * Server-safe entry point for @open-email/editor.
 * Import from "@open-email/editor/server" in Node.js / API routes / Server Components.
 * This module is built without "use client" so it can run in Next.js server environments.
 */

// ── Rendering ──────────────────────────────────────────────────────────────
export { renderToHTML, renderToPlainText } from "./renderer/html-renderer";
export { renderToReactEmail } from "./renderer/react-email-renderer";

// ── JSON serialisation ─────────────────────────────────────────────────────
export { exportToJSON, importFromJSON } from "./renderer/json-renderer";

// ── Variable interpolation ─────────────────────────────────────────────────
export {
  interpolateVariables,
  hasVariables,
  extractVariableNames,
} from "./utils/variable-interpolation";
export type { VariableDefinitions } from "./utils/variable-interpolation";

// ── Document / tree operations ─────────────────────────────────────────────
export {
  createNode,
  cloneNode,
  findNode,
  findParent,
  getNodePath,
  updateNode,
  addNode,
  removeNode,
  moveNode,
  flattenTree,
  validateDocument,
  createEmptyDocument,
  generateId,
} from "./engine/operations";

// ── Component registry ─────────────────────────────────────────────────────
export {
  defaultRegistry,
  createRegistry,
  mergeRegistries,
  getComponentsByCategory,
  getComponentDef,
} from "./registry/component-registry";

// ── AI schema helper ───────────────────────────────────────────────────────
export { getAISchema } from "./utils/ai-schema";
export type {
  AIDocumentSchema,
  AIComponentSchema,
  AIPropertySchema,
} from "./utils/ai-schema";

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  NodeId,
  EmailNodeType,
  EmailNode,
  EmailDocument,
  FontConfig,
  VariableDefinition,
  ComponentDefinition,
  ComponentRegistry,
  PropertySchema,
  BaseNodeProps,
  ContainerProps,
  SectionProps,
  RowProps,
  ColumnProps,
  TextProps,
  HeadingProps,
  ButtonProps,
  ImageProps,
  LinkProps,
  HrProps,
  SpacerProps,
  EmailNodeProps,
} from "./types";
