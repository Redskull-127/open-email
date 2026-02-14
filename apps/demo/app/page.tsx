
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
    const [copied, setCopied] = useState(false);
    const command = "npm install @open-email/editor";

    const copyCommand = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                textAlign: "center",
                padding: "2rem",
                background: "linear-gradient(to bottom, #09090b, #18181b)",
                color: "#fafafa",
                fontFamily: "Inter, system-ui, sans-serif",
            }}
        >
            {/* Logo */}
            <div style={{ marginBottom: "2rem" }}>
                <Image
                    src="/logo.png"
                    alt="Open Email Logo"
                    width={120}
                    height={120}
                    style={{ borderRadius: "20px" }}
                    priority
                />
            </div>

            {/* Hero Content */}
            <h1
                style={{
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    marginBottom: "1rem",
                    lineHeight: 1.1,
                    background: "linear-gradient(to right, #fff, #a1a1aa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                Open Email Editor
            </h1>

            <p
                style={{
                    fontSize: "1.25rem",
                    color: "#a1a1aa",
                    marginBottom: "3rem",
                    maxWidth: "600px",
                    lineHeight: 1.6,
                }}
            >
                The open-source visual email editor for modern React applications.
                Build beautiful emails with drag-and-drop.
            </p>

            {/* Install Command */}
            <div
                onClick={copyCommand}
                style={{
                    background: "#27272a",
                    border: "1px solid #3f3f46",
                    borderRadius: "12px",
                    padding: "1rem 1.5rem",
                    fontFamily: "monospace",
                    fontSize: "1rem",
                    color: "#e4e4e7",
                    cursor: "pointer",
                    marginBottom: "3rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                className="hover:border-zinc-500"
            >
                <span>$ {command}</span>
                <span style={{ color: "#71717a", fontSize: "0.875rem" }}>
                    {copied ? "Copied!" : "Click to copy"}
                </span>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                <Link
                    href="/demo"
                    style={{
                        background: "#22c55e",
                        color: "#000",
                        padding: "0.75rem 2rem",
                        borderRadius: "50px",
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "transform 0.2s",
                    }}
                >
                    Try Demo
                </Link>
                <a
                    href="https://github.com/Redskull-127/open-email"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        background: "#fff",
                        color: "#000",
                        padding: "0.75rem 2rem",
                        borderRadius: "50px",
                        fontWeight: 600,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    Star on GitHub
                </a>
                <a
                    href="/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        background: "transparent",
                        border: "1px solid #52525b",
                        color: "#fff",
                        padding: "0.75rem 2rem",
                        borderRadius: "50px",
                        fontWeight: 600,
                        textDecoration: "none",
                    }}
                >
                    Documentation
                </a>
            </div>
        </main>
    );
}
