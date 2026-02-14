// ─── JSON Renderer ───────────────────────────────────────────────────────────
// Serialization/deserialization of EmailDocument to/from JSON.

import type { EmailDocument } from "../types";
import { validateDocument } from "../engine/operations";

/**
 * Export an EmailDocument to a JSON string.
 */
export function exportToJSON(document: EmailDocument, pretty = true): string {
  return JSON.stringify(document, null, pretty ? 2 : undefined);
}

/**
 * Import an EmailDocument from a JSON string.
 * Validates the document structure and throws on invalid input.
 */
export function importFromJSON(json: string): EmailDocument {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON string");
  }

  const doc = parsed as EmailDocument;

  // Basic shape validation
  if (!doc || typeof doc !== "object") {
    throw new Error("Invalid document: must be an object");
  }
  if (doc.version !== 1) {
    throw new Error(`Unsupported document version: ${doc.version}`);
  }
  if (!doc.body || !doc.body.type || !doc.body.id) {
    throw new Error("Invalid document: body must have type and id");
  }
  if (!doc.meta || !doc.meta.title) {
    throw new Error("Invalid document: meta.title is required");
  }

  const errors = validateDocument(doc);
  if (errors.length > 0) {
    throw new Error(`Invalid document:\n${errors.join("\n")}`);
  }

  return doc;
}
