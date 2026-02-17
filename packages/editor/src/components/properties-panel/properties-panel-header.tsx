import React from "react";
import { Icons } from "../icons";

export interface PropertiesPanelHeaderProps {
  title: string;
  onDelete: () => void;
}

export function PropertiesPanelHeader({
  title,
  onDelete,
}: PropertiesPanelHeaderProps) {
  return React.createElement(
    "div",
    { className: "oe-properties-header" },
    React.createElement(
      "span",
      { className: "oe-properties-title" },
      title,
    ),
    React.createElement(
      "button",
      {
        className: "oe-btn-icon",
        onClick: onDelete,
        title: "Delete element",
        style: { color: "var(--oe-danger)" },
      },
      React.createElement(Icons.trash, { size: 16 }),
    ),
  );
}
