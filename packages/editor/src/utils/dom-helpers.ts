export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function insertVariableIntoContent(
  existing: string | undefined,
  variableName: string
): string {
  const insert = `{{${variableName}}}`;
  const content = existing?.trim() || "";
  return content ? `${content} ${insert}` : insert;
}
