// ─── HTML Renderer ───────────────────────────────────────────────────────────
// Uses @react-email/render to convert the React Email element tree to HTML.

import { render } from "@react-email/render";
import type { EmailDocument } from "../types";
import { renderToReactEmail } from "./react-email-renderer";

/**
 * Render an EmailDocument to an HTML string.
 * This produces email-client-compatible HTML with table-based layout.
 */
export async function renderToHTML(document: EmailDocument): Promise<string> {
  const element = renderToReactEmail(document);
  const html = await render(element);
  return html;
}

/**
 * Render an EmailDocument to plain text (for text-only email fallback).
 */
export async function renderToPlainText(document: EmailDocument): Promise<string> {
  const element = renderToReactEmail(document);
  const text = await render(element, { plainText: true });
  return text;
}
