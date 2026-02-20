import { defaultRegistry } from "../registry/component-registry";
import type { ComponentRegistry } from "../types";

export interface AIPropertySchema {
  key: string;
  label: string;
  type: string;
  defaultValue?: unknown;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface AIComponentSchema {
  type: string;
  label: string;
  description: string;
  category: string;
  acceptsChildren: boolean;
  defaultProps: Record<string, unknown>;
  properties: AIPropertySchema[];
}

export interface AIDocumentSchema {
  components: AIComponentSchema[];
  documentMeta: {
    description: string;
    fields: AIPropertySchema[];
  };
}

/**
 * Returns a fully self-describing schema of every available component and
 * document-level field. Feed this into an LLM system prompt so it can produce
 * valid EmailDocument JSON without hallucinating component types or prop names.
 *
 * @example
 * // In a server action / API route
 * import { getAISchema } from "@open-email/editor/server";
 *
 * const schema = getAISchema();
 * const systemPrompt = `You are an email builder. Use this schema:\n${JSON.stringify(schema)}`;
 */
export function getAISchema(registry?: ComponentRegistry): AIDocumentSchema {
  const reg = registry ?? defaultRegistry;
  const SKIP = new Set(["font", "tailwind", "preview"]);

  const components: AIComponentSchema[] = [];
  for (const def of reg.values()) {
    if (SKIP.has(def.type)) continue;
    components.push({
      type: def.type,
      label: def.label,
      description: def.description ?? "",
      category: def.category,
      acceptsChildren: def.acceptsChildren,
      defaultProps: def.defaultProps,
      properties: def.properties.map((p) => ({
        key: p.key,
        label: p.label,
        type: p.type,
        ...(p.defaultValue !== undefined ? { defaultValue: p.defaultValue } : {}),
        ...(p.placeholder ? { placeholder: p.placeholder } : {}),
        ...(p.options ? { options: p.options } : {}),
      })),
    });
  }

  return {
    components,
    documentMeta: {
      description:
        "Top-level email metadata. Set these fields on EmailDocument.meta.",
      fields: [
        { key: "title", label: "Email Title", type: "text" },
        { key: "subject", label: "Email Subject", type: "text" },
        { key: "previewText", label: "Preview Text (shown in inbox)", type: "text" },
        { key: "description", label: "Internal description", type: "textarea" },
        {
          key: "tailwind.enabled",
          label: "Enable Tailwind CSS",
          type: "boolean",
          defaultValue: true,
        },
        {
          key: "tailwind.config",
          label: "Tailwind theme config (JSON string)",
          type: "textarea",
          placeholder: '{"theme":{"extend":{"colors":{"brand":"#4f46e5"}}}}',
        },
        {
          key: "fonts",
          label: "Web fonts array",
          type: "array",
          placeholder:
            '[{"fontFamily":"Inter","fallbackFontFamily":"sans-serif","webFontUrl":"https://...","webFontFormat":"woff2"}]',
        },
      ],
    },
  };
}
