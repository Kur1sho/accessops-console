type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, id, style, ...props }: InputProps) {
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label htmlFor={inputId} style={{ fontWeight: 700, fontSize: 13 }}>
        {label}
      </label>

      <input
        id={inputId}
        {...props}
        style={{
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "rgba(0,0,0,0.12)",
          color: "var(--text)",
          padding: "10px 12px",
          outline: "none",
          ...style,
        }}
      />

      {hint && !error && <div style={{ color: "var(--muted)", fontSize: 12 }}>{hint}</div>}
      {error && <div style={{ color: "#fca5a5", fontSize: 12, fontWeight: 700 }}>{error}</div>}
    </div>
  );
}