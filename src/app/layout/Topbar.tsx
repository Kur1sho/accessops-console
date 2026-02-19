import "./layout.css";

export function Topbar() {
  return (
    <header className="appTopbar">
      <div style={{ fontWeight: 800 }}>AccessOps Console</div>
      <div style={{ color: "var(--muted)", fontSize: 13 }}>React + TypeScript</div>
    </header>
  );
}


const topbarStyle: React.CSSProperties = {
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  borderBottom: "1px solid #e5e7eb",
};
