"use client";

import { useState, useCallback } from "react";
import { EmailEditor, type EmailDocument } from "@open-email/editor";
import "@open-email/editor/styles.css";
import { sendEmail } from "@/lib/actions/actions";
import DialogComponent from "./dialog";
import createSampleDocument from "./sampleDocument";

export default function HomePage() {
  const [doc, setDoc] = useState<EmailDocument>(createSampleDocument());
  const [showDialog, setShowDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [pendingHTML, setPendingHTML] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleExportHTML = useCallback(async (html: string) => {
    setPendingHTML(html);
    setShowDialog(true);
  }, []);

  const handleSendEmail = useCallback(async () => {
    if (!emailAddress.trim() || !pendingHTML || !subject.trim()) return;
    setIsSending(true);

    const { data, error } = await sendEmail(
      emailAddress.trim(),
      subject.trim(),
      pendingHTML,
    );

    setShowDialog(false);
    setEmailAddress("");
    setSubject("");
    setPendingHTML(null);

    if (error) {
      alert(`Error sending email. Please try again.`);
    } else {
      alert("Email sent successfully!");
    }
    setIsSending(false);
  }, [emailAddress, pendingHTML, subject]);

  const handleExportJSON = useCallback((json: string) => {
    navigator.clipboard.writeText(json).then(() => {
      alert("JSON copied to clipboard!");
    });
  }, []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Editor */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <EmailEditor
          initialDocument={doc}
          onChange={setDoc}
          components={{
            ExportHTMLButton: ({ onClick, loading }) => (
              <button
                onClick={onClick}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Generating..." : "🚀 Send Email"}
              </button>
            ),
          }}
          onExportHTML={handleExportHTML}
          onExportJSON={handleExportJSON}
          style={{ height: "100%", borderRadius: 0, border: "none" }}
        />
      </div>

      {/* Email Dialog */}
      {showDialog && (
        <DialogComponent
          isSending={isSending}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          emailAddress={emailAddress}
          setEmailAddress={setEmailAddress}
          subject={subject}
          setSubject={setSubject}
          pendingHTML={pendingHTML}
          setPendingHTML={setPendingHTML}
          handleSendEmail={handleSendEmail}
        />
      )}
    </div>
  );
}
