import { render } from "@react-email/render";
import type { EmailDocument } from "../types";
import { renderToReactEmail } from "./react-email-renderer";

export async function renderToHTML(
  document: EmailDocument,
  variableData?: Record<string, string>
): Promise<string> {
  const element = renderToReactEmail(document, variableData);
  const html = await render(element);
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
