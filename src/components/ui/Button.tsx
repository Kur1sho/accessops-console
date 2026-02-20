type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ variant = "primary", style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    borderRadius: 12,
    padding: "10px 14px",
    border: "1px solid var(--border)",
    background: "var(--panel)",
    color: "var(--text)",
    cursor: "pointer",
    fontWeight: 700,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "rgba(59,130,246,0.35)" },
    secondary: { background: "var(--panel)" },
    danger: { background: "rgba(239,68,68,0.25)" },
  };

  return <button {...props} style={{ ...base, ...variants[variant], ...style }} />;
}