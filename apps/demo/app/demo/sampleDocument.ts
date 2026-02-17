import {
    createNode,
    type EmailDocument,
} from "@open-email/editor";

export default function createSampleDocument(): EmailDocument {
    return {
        version: 1,
        meta: {
            title: "Welcome Email",
            subject: "Welcome to Open Email!",
            previewText: "Check out our open-source email editor",
        },
        body: createNode("container", { maxWidth: "600px", style: { backgroundColor: "#ffffff", padding: "24px" } }, [
            // Header
            createNode("section", { style: { backgroundColor: "#5046e5", padding: "32px 24px", borderRadius: "8px 8px 0 0" } }, [
                createNode("heading", {
                    content: "✉️ Open Email Editor",
                    as: "h1",
                    style: { color: "#ffffff", textAlign: "center", fontSize: "28px" },
                }, [], "header-heading"),
                createNode("text", {
                    content: "Build beautiful emails with React Email components",
                    style: { color: "#c7d2fe", textAlign: "center", fontSize: "16px", marginTop: "8px" },
                }, [], "header-subtext"),
            ], "header-section"),

            // Content
            createNode("section", { style: { padding: "32px 24px" } }, [
                createNode("heading", {
                    content: "Welcome aboard! 🎉",
                    as: "h2",
                    style: { fontSize: "22px", color: "#111827" },
                }, [], "content-heading"),
                createNode("text", {
                    content:
                        "Thanks for trying out Open Email Editor — the open-source, shadcn-style email editor built on top of React Email. This editor gives you full control over your email templates with a visual builder and code editor.",
                    style: { fontSize: "15px", lineHeight: "1.7", color: "#374151", marginTop: "12px" },
                }, [], "content-text"),
            ], "content-section"),

            // Features row
            createNode("section", { style: { padding: "0 24px 24px" } }, [
                createNode("row", {}, [
                    createNode("column", { style: { padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" } }, [
                        createNode("heading", { content: "📦 Components", as: "h3", style: { fontSize: "16px" } }, [], "feature-1-heading"),
                        createNode("text", {
                            content: "All React Email components at your fingertips",
                            style: { fontSize: "13px", color: "#64748b" },
                        }, [], "feature-1-text"),
                    ], "feature-column-1"),
                    createNode("column", { style: { padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" } }, [
                        createNode("heading", { content: "🎨 Customizable", as: "h3", style: { fontSize: "16px" } }, [], "feature-2-heading"),
                        createNode("text", {
                            content: "shadcn-style — override everything via props or CSS",
                            style: { fontSize: "13px", color: "#64748b" },
                        }, [], "feature-2-text"),
                    ], "feature-column-2"),
                ], "features-row"),
            ], "features-section"),

            // CTA
            createNode("section", { style: { padding: "8px 24px 32px", textAlign: "center" } }, [
                createNode("button", {
                    text: "Get Started →",
                    href: "https://github.com",
                    backgroundColor: "#5046e5",
                    color: "#ffffff",
                    borderRadius: "8px",
                    padding: "14px 32px",
                }, [], "cta-button"),
            ], "cta-section"),

            // Divider
            createNode("hr", { borderColor: "#e5e7eb", borderWidth: "1px" }, [], "divider"),

            // Footer
            createNode("section", { style: { padding: "24px", textAlign: "center" } }, [
                createNode("text", {
                    content: "Open Email Editor — MIT Licensed",
                    style: { fontSize: "12px", color: "#9ca3af" },
                }, [], "footer-text"),
                createNode("link", {
                    content: "View on GitHub",
                    href: "https://github.com",
                    color: "#5046e5",
                }, [], "footer-link"),
            ], "footer-section"),
        ], "root-container"),
    };
}