import { useEffect, useRef } from "react";

export function Modal({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC, basic focus management
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    // focus first focusable element
    setTimeout(() => {
      const root = panelRef.current;
      if (!root) return;
      const el = root.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      el?.focus();
    }, 0);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // click backdrop to close
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 18,
        zIndex: 2000,
      }}
    >
      <div
        ref={panelRef}
        style={{
          width: "min(640px, 100%)",
          borderRadius: 18,
          border: "1px solid var(--border)",
          background: "rgba(15, 23, 42, 0.92)",
          backdropFilter: "blur(14px)",
          boxShadow: "var(--shadow)",
          padding: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--panel)",
              color: "var(--text)",
              padding: "8px 10px",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ height: 12 }} />

        {children}
      </div>
    </div>
  );
}