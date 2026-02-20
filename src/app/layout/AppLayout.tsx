import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import "./layout.css";

export function AppLayout() {
  return (
    <div>
      <a className="skipLink" href="#main">Skip to content</a>

      <Topbar />

      <div className="shell">
        <Sidebar />
        <main id="main" className="main">
          <div className="panel" style={{ padding: 18 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

`const shellStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  minHeight: "calc(100vh - 56px)",
};

const mainStyle: React.CSSProperties = {
  padding: "24px",
};

const skipLinkStyle: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  top: 8,
  background: "white",
  color: "black",
  padding: "8px 12px",
  borderRadius: 8,
  zIndex: 1000,
};`
