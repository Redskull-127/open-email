export type VariableDefinitions = Record<string, { fallback: string }>;

const VARIABLE_PATTERN = /\{\{(\w+)\}\}/g;

export function interpolateVariables(
  content: string,
  variableData: Record<string, string | undefined> | undefined,
  variableDefinitions: VariableDefinitions | undefined
): string {
  if (typeof content !== "string") return "";
  const defs = variableDefinitions ?? {};
  const data = variableData ?? {};

  return content.replace(VARIABLE_PATTERN, (_, key: string) => {
    if (data[key] !== undefined && data[key] !== "") return data[key] as string;
    return defs[key]?.fallback ?? "";
  });
}

export function hasVariables(content: string): boolean {
  return typeof content === "string" && VARIABLE_PATTERN.test(content);
}

export function extractVariableNames(content: string): string[] {
  if (typeof content !== "string") return [];
  const names = new Set<string>();
  let match: RegExpExecArray | null;
  const re = new RegExp(VARIABLE_PATTERN);
  while ((match = re.exec(content)) !== null) {
    names.add(match[1]);
  }
  return Array.from(names);
}
