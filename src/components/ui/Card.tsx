export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}