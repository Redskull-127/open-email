import React from "react";
import type { PropertySchema } from "../../types";
import { PropertyField } from "./property-field";
import { resolveValue, GROUP_LABELS } from "./utils";

export interface PropertiesGroupProps {
  group: string;
  properties: PropertySchema[];
  nodeProps: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function PropertiesGroup({
  group,
  properties,
  nodeProps,
  onChange,
}: PropertiesGroupProps) {
  return React.createElement(
    "div",
    { className: "oe-properties-group" },
    React.createElement(
      "div",
      { className: "oe-properties-group-title" },
      GROUP_LABELS[group] ?? group,
    ),
    ...properties.map((prop) =>
      React.createElement(PropertyField, {
        key: prop.key,
        schema: prop,
        value: resolveValue(nodeProps, prop.key),
        onChange,
      }),
    ),
  );
}
