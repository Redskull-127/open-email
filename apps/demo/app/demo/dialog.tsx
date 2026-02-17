export default function DialogComponent({
  isSending,
  showDialog,
  setShowDialog,
  emailAddress,
  setEmailAddress,
  subject,
  setSubject,
  pendingHTML,
  setPendingHTML,
  handleSendEmail,
}: {
  isSending: boolean;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  emailAddress: string;
  setEmailAddress: (email: string) => void;
  subject: string;
  setSubject: (subject: string) => void;
  pendingHTML: string | null;
  setPendingHTML: (html: string | null) => void;
  handleSendEmail: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={() => {
        setShowDialog(false);
        setEmailAddress("");
        setSubject("");
        setPendingHTML(null);
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: "0 0 16px 0",
            fontSize: "20px",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Enter Email Address
        </h2>
        <input
          type="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder="recipient@example.com"
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "14px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && emailAddress.trim()) {
              handleSendEmail();
            }
          }}
          autoFocus
        />
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "14px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && subject.trim()) {
              handleSendEmail();
            }
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => {
              setShowDialog(false);
              setEmailAddress("");
              setSubject("");
              setPendingHTML(null);
            }}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 500,
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: "white",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={!emailAddress.trim() || isSending}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              borderRadius: "6px",
              backgroundColor:
                emailAddress.trim() && !isSending ? "#5046e5" : "#9ca3af",
              color: "white",
              cursor:
                emailAddress.trim() && !isSending ? "pointer" : "not-allowed",
            }}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
