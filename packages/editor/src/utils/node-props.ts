function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeNodePropValue(value: unknown): unknown {
  return value === "" ? undefined : value;
}

function setNestedPath(
  source: Record<string, unknown>,
  path: string[],
  value: unknown,
): Record<string, unknown> {
  if (path.length === 0) return source;

  const [head, ...tail] = path;
  if (tail.length === 0) {
    return { ...source, [head]: value };
  }

  const current = source[head];
  const nextSource = isRecord(current) ? current : {};

  return {
    ...source,
    [head]: setNestedPath(nextSource, tail, value),
  };
}

export function buildNodePatchFromPropertyKey(
  nodeProps: Record<string, unknown>,
  key: string,
  value: unknown,
): Record<string, unknown> {
  const normalizedValue = normalizeNodePropValue(value);
  if (!key.includes(".")) {
    return { [key]: normalizedValue };
  }

  const [root, ...path] = key.split(".");
  const existingRoot = nodeProps[root];
  const rootRecord = isRecord(existingRoot) ? existingRoot : {};

  return {
    [root]: setNestedPath(rootRecord, path, normalizedValue),
  };
}
