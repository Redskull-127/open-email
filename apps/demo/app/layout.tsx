import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Open Email Editor — Demo",
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
            <body>{children}</body>
        </html>
    );
}
