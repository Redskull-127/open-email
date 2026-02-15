import type { Metadata } from "next";
import { GoogleTagManager } from '@next/third-parties/google'

import "./globals.css";

export const metadata: Metadata = {
    icons: {
        icon: "/logo.png",
    },
    openGraph: {
        title: "Open Email Editor",
        description:
            "Open-source visual email editor built on React Email with shadcn-style customizable components",
        images: "/logo.png",
    },
    title: "Open Email Editor",
    description:
        "Open-source visual email editor built on React Email with shadcn-style customizable components",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <GoogleTagManager gtmId="G-DDY4B2TPJE" />
            <body>{children}</body>
        </html>
    );
}
