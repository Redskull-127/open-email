import React, { useEffect, useRef, useState } from "react";

interface InlineTextEditorProps {
  isEditing: boolean;
  value: string;
  multiline?: boolean;
  placeholder?: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
  renderDisplay: (value: string) => React.ReactElement;
}

export function InlineTextEditor({
  isEditing,
  value,
  multiline = false,
  placeholder,
  onCommit,
  onCancel,
  renderDisplay,
}: InlineTextEditorProps) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value, isEditing]);

  useEffect(() => {
    if (!isEditing || !inputRef.current) return;
    inputRef.current.focus();
    const length = inputRef.current.value.length;
    inputRef.current.setSelectionRange(length, length);
  }, [isEditing]);

  if (!isEditing) {
    return renderDisplay(value);
  }

  const handleCommit = () => {
    onCommit(draft);
  };

  const handleCancel = () => {
    setDraft(value);
    onCancel();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      handleCancel();
      return;
    }

    if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      e.stopPropagation();
      handleCommit();
    }
  };

  if (multiline) {
    return React.createElement("textarea", {
      ref: inputRef as React.RefObject<HTMLTextAreaElement>,
      className: "oe-inline-editor-input oe-inline-editor-textarea",
      value: draft,
      placeholder,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onBlur: handleCommit,
      onKeyDown: handleKeyDown,
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
      onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
    });
  }

  return React.createElement("input", {
    ref: inputRef as React.RefObject<HTMLInputElement>,
    type: "text",
    className: "oe-inline-editor-input",
    value: draft,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value),
    onBlur: handleCommit,
    onKeyDown: handleKeyDown,
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
  });
}
