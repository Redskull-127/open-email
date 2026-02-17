import React, { useCallback } from "react";
import type { PropertySchema } from "../../types";

export interface PropertyFieldProps {
  schema: PropertySchema;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}

export function PropertyField({ schema, value, onChange }: PropertyFieldProps) {
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      let newValue: unknown = e.target.value;

      if (schema.type === "number") {
        newValue = e.target.value === "" ? undefined : Number(e.target.value);
      } else if (schema.type === "toggle") {
        newValue = (e.target as HTMLInputElement).checked;
      }

      onChange(schema.key, newValue);
    },
    [schema.key, schema.type, onChange],
  );

  const stringValue =
    value !== undefined && value !== null ? String(value) : "";

  switch (schema.type) {
    case "textarea":
      return React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement(
          "label",
          { className: "oe-field-label" },
          schema.label,
        ),
        React.createElement("textarea", {
          className: "oe-field-textarea",
          value: stringValue,
          onChange: handleChange,
          placeholder: schema.placeholder ?? "",
        }),
      );

    case "select":
      return React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement(
          "label",
          { className: "oe-field-label" },
          schema.label,
        ),
        React.createElement(
          "select",
          {
            className: "oe-field-select",
            value: stringValue,
            onChange: handleChange,
          },
          React.createElement("option", { value: "" }, "—"),
          ...(schema.options ?? []).map((opt) =>
            React.createElement(
              "option",
              { key: opt.value, value: opt.value },
              opt.label,
            ),
          ),
        ),
      );

    case "color":
      return React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement(
          "label",
          { className: "oe-field-label" },
          schema.label,
        ),
        React.createElement(
          "div",
          { className: "oe-field-color-wrapper" },
          React.createElement("input", {
            type: "color",
            className: "oe-field-color-swatch",
            value: stringValue || "#000000",
            onChange: handleChange,
          }),
          React.createElement("input", {
            type: "text",
            className: "oe-field-input",
            value: stringValue,
            onChange: handleChange,
            placeholder: "#000000",
            style: { flex: 1 },
          }),
        ),
      );

    case "toggle":
      return React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement(
          "label",
          {
            className: "oe-field-label",
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            },
          },
          React.createElement("input", {
            type: "checkbox",
            checked: !!value,
            onChange: handleChange,
          }),
          schema.label,
        ),
      );

    case "number":
      return React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement(
          "label",
          { className: "oe-field-label" },
          schema.label,
        ),
        React.createElement("input", {
          type: "number",
          className: "oe-field-input",
          value: stringValue,
          onChange: handleChange,
          placeholder: schema.placeholder ?? "",
        }),
      );

    case "url":
    case "text":
    case "spacing":
    default:
      return React.createElement(
        "div",
        { className: "oe-field" },
        React.createElement(
          "label",
          { className: "oe-field-label" },
          schema.label,
        ),
        React.createElement("input", {
          type: schema.type === "url" ? "url" : "text",
          className: "oe-field-input",
          value: stringValue,
          onChange: handleChange,
          placeholder: schema.placeholder ?? "",
        }),
      );
  }
}
