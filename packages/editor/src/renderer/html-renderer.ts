import { render } from "@react-email/render";
import type { EmailDocument } from "../types";
import { renderToReactEmail } from "./react-email-renderer";

export async function renderToHTML(
  document: EmailDocument,
  variableData?: Record<string, string>
): Promise<string> {
  const element = renderToReactEmail(document, variableData);
  let html = await render(element);

  // Disable preflight so Tailwind doesn't reset the email's table/div layout.
  // Merge with any user-supplied theme config.
  let mergedConfig: Record<string, unknown> = { corePlugins: { preflight: false } };
  if (document.meta.tailwind?.config) {
    try {
      const userConfig = JSON.parse(document.meta.tailwind.config) as Record<string, unknown>;
      mergedConfig = {
        ...userConfig,
        corePlugins: { ...(userConfig.corePlugins as object ?? {}), preflight: false },
      };
    } catch { /* ignore malformed JSON */ }
  }
  // CDN must come first — it defines window.tailwind (and overwrites anything
  // set before it). The config script comes after; it runs before
  // DOMContentLoaded fires, so the CDN picks it up on its first DOM scan.
  const injection =
    `<script src="https://cdn.tailwindcss.com"></script>` +
    `<script>tailwind.config=${JSON.stringify(mergedConfig)}</script>`;
  html = html.replace("</head>", `${injection}</head>`);

  return html;
}

export async function renderToPlainText(
  document: EmailDocument,
  variableData?: Record<string, string>
): Promise<string> {
  const element = renderToReactEmail(document, variableData);
  const text = await render(element, { plainText: true });
  return text;
}
