// ─── Icons ───────────────────────────────────────────────────────────────────
// Simple inline SVG icons for the editor UI. Users can replace these.

import React from "react";

interface IconProps {
    size?: number;
    className?: string;
}

function icon(paths: string, viewBox = "0 0 24 24") {
    return function Icon({ size = 16, className }: IconProps) {
        return React.createElement("svg", {
            width: size,
            height: size,
            viewBox,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 2,
            strokeLinecap: "round" as const,
            strokeLinejoin: "round" as const,
            className,
            dangerouslySetInnerHTML: { __html: paths },
        });
    };
}

export const Icons = {
    box: icon('<rect x="3" y="3" width="18" height="18" rx="2"/>'),
    layout: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>'),
    columns: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>'),
    sidebar: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>'),
    type: icon('<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>'),
    heading: icon('<path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/>'),
    mousePointer: icon('<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/>'),
    image: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>'),
    externalLink: icon('<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'),
    minus: icon('<line x1="5" y1="12" x2="19" y2="12"/>'),
    moveVertical: icon('<polyline points="8 18 12 22 16 18"/><polyline points="8 6 12 2 16 6"/><line x1="12" y1="2" x2="12" y2="22"/>'),
    eye: icon('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
    code: icon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
    monitor: icon('<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'),
    download: icon('<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'),
    trash: icon('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>'),
    plus: icon('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),
    layers: icon('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'),
    chevronRight: icon('<polyline points="9 18 15 12 9 6"/>'),
    chevronDown: icon('<polyline points="6 9 12 15 18 9"/>'),
    settings: icon('<circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-9-11h2m18 0h2M5.6 5.6l1.4 1.4m9.9 9.9l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/>'),
    copy: icon('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>'),
    check: icon('<polyline points="20 6 9 17 4 12"/>'),
    close: icon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
};

/** Get an icon component by name */
export function getIcon(name: string): React.ComponentType<IconProps> {
    return (Icons as Record<string, React.ComponentType<IconProps>>)[name] ?? Icons.box;
}
