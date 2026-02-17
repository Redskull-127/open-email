import React from "react";
import { Icons } from "../icons";

export interface PropertiesPanelEmptyProps {
  className?: string;
}

export function PropertiesPanelEmpty({ className }: PropertiesPanelEmptyProps) {
  return React.createElement(
    "div",
    { className: `oe-properties ${className ?? ""}` },
    React.createElement(
      "div",
      { className: "oe-properties-empty" },
      React.createElement(Icons.settings, { size: 32 }),
      React.createElement(
        "p",
        null,
        "Select an element to edit its properties",
      ),
    ),
  );
}
