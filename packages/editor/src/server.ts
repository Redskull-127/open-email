/**
 * Server-safe entry point for @open-email/editor.
 * Import from "@open-email/editor/server" in Node.js, API routes, or Server Components.
 * This module is built without "use client" so it can run in Next.js server environments.
 */

export { renderToHTML, renderToPlainText } from "./renderer/html-renderer";
export { renderToReactEmail } from "./renderer/react-email-renderer";
export type { EmailDocument, EmailNode } from "./types";
